import uuid
from typing import Optional, List, Dict, Any

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
    arrival_method = Column(String)
    on_shift = Column(Boolean)
    triage_acuity = Column(String)
    chief_complaints = Column(String)
    arrival_time = Column(DateTime)
    departure_time = Column(DateTime)
    departure_dest = Column(String)
    handover_from = Column(String, nullable=True)
    date = Column(DateTime)
    handover_too = Column(String)
    comment = Column(String, nullable=True)


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
            PatientEncounter.document_number == document_number,
            PatientEncounter.deleted == False,
        )
        .first()
    )


def get_all_patient_encounters(db: Session) -> Optional[List[PatientEncounter]]:
    return db.query(PatientEncounter).filter(PatientEncounter.deleted == False)


def create_patient_encounter(db: Session, data: PatientEncounter) -> PatientEncounter:
    """Create a patient encounter with a unique ID.

    Returns:
        A PatientEncounter.
    """
    created_patient_encounter = data
    db.add(created_patient_encounter)
    db.commit()
    db.refresh(created_patient_encounter)

    return created_patient_encounter


def update_patient_encounter(
    db: Session, encounter: PatientEncounter, updated_values: Dict[str, Any]
) -> PatientEncounter:
    """
    Update an existing patient encounter document. Returns the updated patient encounter.
    """
    updated_encounter = encounter
    db.query(PatientEncounter).filter(PatientEncounter.deleted == True).update(
        values=updated_values
    )
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
