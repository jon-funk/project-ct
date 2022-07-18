from importlib.abc import PathEntryFinder
import uuid
from datetime import datetime
from typing import Union, List

from passlib.hash import argon2
from sqlalchemy import Column, DateTime, Integer, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Session

from api.main.database import Base
from api.models.mixins import BasicMetrics


class PatientEncounter(Base, BasicMetrics):
    __tablename__ = "patient_encounters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_incident_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    user_uuid = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    document_number = Column(String)
    rfid = Column(String)
    qr_code = Column(String)
    arrival_method = Column(String)
    on_shift = Column(Boolean)
    triage_category = Column(String)
    presenting_complaint = Column(String)
    arrival_timestamp = Column(DateTime)
    departure_timestamp = Column(DateTime)


def get_patient_encounter_by_id(db: Session, id: int) -> Union[PatientEncounter, None]:
    return db.query(PatientEncounter).filter(PatientEncounter.id == id).first()


def get_patient_encounter_by_document_number(db: Session, document_number: str) -> Union[PatientEncounter, None]:
    return db.query(PatientEncounter).filter(PatientEncounter.document_number == document_number).first()

def get_all_patient_encounters(db: Session) -> Union[List[PatientEncounter], None]:
    return db.query(PatientEncounter).all()

def create_patient_encounter(db: Session) -> PatientEncounter:
    """Create a blank patient encounter with only a unique ID.

    Returns:
        A PatientEncounter schema.
    """
    created_patient_encounter = PatientEncounter()
    db.add(created_patient_encounter)
    db.commit()
    db.refresh(created_patient_encounter)

    return created_patient_encounter