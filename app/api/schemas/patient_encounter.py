from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class BasePatientEncounterSchema(BaseModel):
    """
    A base schema for patient encounters, excluding patient RFID.
    """

    age: Optional[int]
    arrival_method: str
    arrival_date: datetime
    arrival_time: datetime
    chief_complaints: str
    comment: str
    departure_time: Optional[datetime]
    departure_date: Optional[datetime]
    departure_dest: Optional[str]
    document_num: str
    gender: Optional[str]
    handover_from: Optional[str]
    handover_too: str
    location: str
    on_shift: bool
    qr_code: Optional[str]
    triage_acuity: str

    class Config:
        orm_mode = True


class PatientEncounterSchema(BasePatientEncounterSchema):
    """
    An encounter with a given patient, including patient RFID.
    """

    patient_rfid: Optional[str]


class PatientEncounterResponseSchema(BasePatientEncounterSchema):
    """
    The patient encounter response schema, without patient RFID.
    """
    # document uuid is created server-side when a document is created
    patient_encounter_uuid: Optional[UUID]

    class Config:
        orm_mode = True
