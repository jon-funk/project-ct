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
    handover_from = Column(String)
    date = Column(DateTime)
    handover_too = Column(String)
    comment = Column(String, nullable=True)


def get_patient_encounter_by_id(db: Session, id: int) -> Union[PatientEncounter, None]:
    return db.query(PatientEncounter).filter(PatientEncounter.id == id).first()


def get_patient_encounter_by_document_number(db: Session, document_number: str) -> Union[PatientEncounter, None]:
    return db.query(PatientEncounter).filter(PatientEncounter.document_number == document_number).first()

def get_all_patient_encounters(db: Session) -> Union[List[PatientEncounter], None]:
    return db.query(PatientEncounter).all()

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