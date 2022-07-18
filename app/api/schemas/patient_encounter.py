from typing import List
from pydantic import BaseModel


class PatientEncounter(BaseModel):
    """
    An encounter with a given patient.
    """    
    patient_incident_uuid: str
    user_uuid: str
    document_number: str
    rfid: str
    qr_code: str
    arrival_method: str
    on_shift: bool
    triage_category: str
    presenting_complaint: str
    arrival_timestamp: str
    departure_timestamp: str


class PatientEncounterList(BaseModel):
    """
    A list of patient encounters.
    """
    patient_encounters: List[PatientEncounter]

    class Config:
        orm_mode = True