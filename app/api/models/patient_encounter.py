import uuid
from typing import Optional, List, Dict, Any

from passlib.hash import argon2
from sqlalchemy import Column, DateTime, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.main.database import Base
from api.models.mixins import BasicMetrics


class PatientEncounter(Base, BasicMetrics):
    __tablename__ = "patient_encounters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_encounter_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)
    document_num = Column(String)
    patient_rfid = Column(String, nullable=True)
    location = Column(String)
    qr_code = Column(String, nullable=True)
    arrival_date = Column(DateTime)
    arrival_method = Column(String)
    arrival_time = Column(DateTime)
    on_shift = Column(Boolean)
    triage_acuity = Column(String)
    chief_complaints = Column(String)
    departure_date = Column(DateTime, nullable=True)
    departure_time = Column(DateTime, nullable=True)
    departure_dest = Column(String, nullable=True)
    handover_from = Column(String, nullable=True)
    handover_too = Column(String)
    comment = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)


def get_patient_encounter_by_id(db: Session, id: int) -> Optional[PatientEncounter]:
    return (
        db.query(PatientEncounter)
        .filter(PatientEncounter.id == id, PatientEncounter.deleted == False)
        .first()
    )


def get_patient_encounter_by_uuid(
    db: Session, uuid: uuid.UUID
) -> Optional[PatientEncounter]:
    return (
        db.query(PatientEncounter)
        .filter(
            PatientEncounter.patient_encounter_uuid == uuid,
            PatientEncounter.deleted == False,
        )
        .first()
    )


def get_patient_encounter_by_document_number(
    db: Session, document_number: str
) -> Optional[PatientEncounter]:
    return (
        db.query(PatientEncounter)
        .filter(
            PatientEncounter.document_num == document_number,
            PatientEncounter.deleted == False,
        )
        .first()
    )


def get_all_patient_encounters(db: Session) -> Optional[List[PatientEncounter]]:
    return db.query(PatientEncounter).filter(PatientEncounter.deleted == False)


def create_patient_encounter(db: Session, data: PatientEncounter) -> PatientEncounter:
    """Create a patient encounter with a unique ID.

    If provided, the patient RFID is hashed before being stored in the database; otherwise, it is stored as null.

    Returns:
        A PatientEncounter.
    """

    created_patient_encounter = data

    if (
        created_patient_encounter.patient_rfid
        and created_patient_encounter.patient_rfid != ""
    ):
        hashed_rfid = argon2.hash(created_patient_encounter.patient_rfid)
        created_patient_encounter.patient_rfid = hashed_rfid

    db.add(created_patient_encounter)
    db.commit()
    db.refresh(created_patient_encounter)

    return created_patient_encounter


def update_patient_encounter(
    db: Session, encounter: PatientEncounter, updated_values: Dict[str, Any]
) -> PatientEncounter:
    """
    Update an existing patient encounter document using its existing UUID. Returns the updated patient encounter.

    If provided, the patient RFID is hashed before being stored in the database; otherwise, it is stored as null.

    """
    updated_encounter = encounter

    # Check if the patient RFID has been updated
    if "patient_rfid" in updated_values:
        updated_rfid = updated_values["patient_rfid"]

        hashed_rfid = argon2.hash(updated_rfid)
        updated_values["patient_rfid"] = hashed_rfid

    db.query(PatientEncounter).filter(
        PatientEncounter.deleted == False,
        PatientEncounter.patient_encounter_uuid == encounter.patient_encounter_uuid,
    ).update(values=updated_values)
    db.commit()
    db.refresh(updated_encounter)

    return updated_encounter


def soft_delete_patient_encounter(db: Session, uuid: uuid.UUID) -> None:
    """
    Update patient encounter property to set deleted to True.
    """
    db.query(PatientEncounter).filter(
        PatientEncounter.patient_encounter_uuid == uuid
    ).update(values={"deleted": True})
    db.commit()
