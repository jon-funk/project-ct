import uuid
from typing import Optional, List, Dict, Any

import argon2 as standalone_argon2
import logging
from passlib.hash import argon2
from sqlalchemy import Column, DateTime, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.main.database import Base
from api.models.mixins import BasicMetrics

logger = logging.getLogger(__name__)

class Intake(Base, BasicMetrics):
    __tablename__ = "intakes"

    intake_uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)
    guest_rfid = Column(String, nullable=True)
    arrival_date = Column(DateTime, nullable=True)
    arrival_time = Column(DateTime, nullable=True)
    arrival_method = Column(String, nullable=True)
    identified_gender = Column(String, nullable=True)
    first_visit = Column(Boolean, nullable=True)
    presenting_complaint = Column(String, nullable=True)
    guest_consciousness_level = Column(String, nullable=True)
    guest_emotional_state = Column(String, nullable=True)
    substance_categories = Column(String, nullable=True)
    time_since_last_dose = Column(Integer, nullable=True)
    discharge_date = Column(DateTime, nullable=True)
    discharge_time = Column(DateTime, nullable=True)
    discharge_method = Column(String, nullable=True)


def get_intake_by_id(db: Session, id: int) -> Optional[Intake]:
    return (
        db.query(Intake)
        .filter(Intake.id == id, Intake.deleted == False)
        .first()
    )


def get_intake_by_uuid(
    db: Session, uuid: uuid.UUID
) -> Optional[Intake]:
    return (
        db.query(Intake)
        .filter(
            Intake.intake_uuid == uuid,
            Intake.deleted == False,
        )
        .first()
    )


def get_latest_intake_by_guest_rfid(
    db: Session, guest_rfid: str
) -> Optional[Intake]:
    """
    Returns the latest patient encounter for a given patient RFID.

    If the patient RFID is found returns the latest patient encounter; otherwise, returns None.


    Returns:
        A Intake.
    """
    intakes = (
        db.query(Intake)
        .filter(Intake.deleted == False)
        .order_by(Intake.last_updated_timestamp.desc())
        .all()
    )

    for encounter in intakes:
        if encounter.guest_rfid.startswith("$argon2"):
            try:
                if argon2.verify(guest_rfid, encounter.guest_rfid):
                    return encounter

            except standalone_argon2.exceptions.VerifyMismatchError:
                continue
            except (
                standalone_argon2.exceptions.VerificationError,
                standalone_argon2.exceptions.InvalidHash,
            ) as e:
                logger.error(e, exc_info=True)
        elif encounter.guest_rfid == guest_rfid:
            return encounter

    return None


def get_all_intakes(db: Session) -> Optional[List[Intake]]:
    return db.query(Intake).filter(Intake.deleted == False)


def create_intake(db: Session, data: Intake) -> Intake:
    """Create a patient encounter with a unique ID.

    If provided, the patient RFID is hashed before being stored in the database; otherwise, it is stored as null.

    Returns:
        A Intake.
    """

    created_intake = data

    if (
        created_intake.guest_rfid
        and created_intake.guest_rfid != ""
    ):
        hashed_rfid = argon2.hash(created_intake.guest_rfid)
        created_intake.guest_rfid = hashed_rfid

    db.add(created_intake)
    db.commit()
    db.refresh(created_intake)

    return created_intake


def update_intake(
    db: Session, encounter: Intake, updated_values: Dict[str, Any]
) -> Intake:
    """
    Update an existing patient encounter document using its existing UUID. Returns the updated patient encounter.

    If provided, the patient RFID is hashed before being stored in the database; otherwise, it is stored as null.

    """
    updated_encounter = encounter

    # Check if the patient RFID has been updated
    if "guest_rfid" in updated_values:
        updated_rfid = updated_values["guest_rfid"]

        hashed_rfid = argon2.hash(updated_rfid)
        updated_values["guest_rfid"] = hashed_rfid

    db.query(Intake).filter(
        Intake.deleted == False,
        Intake.intake_uuid == encounter.intake_uuid,
    ).update(values=updated_values)
    db.commit()
    db.refresh(updated_encounter)

    return updated_encounter


def soft_delete_intake(db: Session, uuid: uuid.UUID) -> None:
    """
    Update patient encounter property to set deleted to True.
    """
    db.query(Intake).filter(
        Intake.intake_uuid == uuid
    ).update(values={"deleted": True})
    db.commit()
