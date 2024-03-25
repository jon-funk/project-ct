import uuid
from typing import Optional, List, Dict, Any

import argon2 as standalone_argon2
import logging
from passlib.hash import argon2
from sqlalchemy import Column, DateTime, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.main.database import BaseSanctuary
from api.models.mixins import BasicMetrics

logger = logging.getLogger(__name__)

class Intake(BaseSanctuary, BasicMetrics):
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
    document_num = Column(String, nullable=True)
    comment = Column(String, nullable=True)

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
    Returns the latest intake for a given guest RFID.

    If the guest RFID is found returns the latest intake; otherwise, returns None.


    Returns:
        A Intake.
    """
    intakes = (
        db.query(Intake)
        .filter(Intake.deleted == False)
        .order_by(Intake.last_updated_timestamp.desc())
        .all()
    )

    for intake in intakes:
        if intake.guest_rfid.startswith("$argon2"):
            try:
                if argon2.verify(guest_rfid, intake.guest_rfid):
                    return intake

            except standalone_argon2.exceptions.VerifyMismatchError:
                continue
            except (
                standalone_argon2.exceptions.VerificationError,
                standalone_argon2.exceptions.InvalidHash,
            ) as e:
                logger.error(e, exc_info=True)
        elif intake.guest_rfid == guest_rfid:
            return intake

    return None


def get_all_intakes(
    db: Session, arrival_date_min: Optional[str], arrival_date_max: Optional[str]
) -> Optional[List[Intake]]:

    # Base query
    query = db.query(Intake).filter(Intake.deleted == False)

    # If arrival_date_min is provided, filter by arrival_date_min
    if arrival_date_min:
        query = query.filter(Intake.arrival_date >= arrival_date_min)

    # If arrival_date_max is provided, filter by arrival_date_max
    if arrival_date_max:
        query = query.filter(Intake.arrival_date <= arrival_date_max)

    return query.all()


def create_intake(db: Session, data: Intake) -> Intake:
    """Create a intake with a unique ID.

    If provided, the guest RFID is hashed before being stored in the database; otherwise, it is stored as null.

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
    db: Session, intake: Intake, updated_values: Dict[str, Any]
) -> Intake:
    """
    Update an existing intake document using its existing UUID. Returns the updated intake.

    If provided, the guest RFID is hashed before being stored in the database; otherwise, it is stored as null.

    """
    updated_intake = intake

    # Check if the guest RFID has been updated
    if "guest_rfid" in updated_values:
        updated_rfid = updated_values["guest_rfid"]

        hashed_rfid = argon2.hash(updated_rfid)
        updated_values["guest_rfid"] = hashed_rfid

    db.query(Intake).filter(
        Intake.deleted == False,
        Intake.intake_uuid == intake.intake_uuid,
    ).update(values=updated_values)
    db.commit()
    db.refresh(updated_intake)

    return updated_intake


def soft_delete_intake(db: Session, uuid: uuid.UUID) -> None:
    """
    Update intake property to set deleted to True.
    """
    db.query(Intake).filter(
        Intake.intake_uuid == uuid
    ).update(values={"deleted": True})
    db.commit()
