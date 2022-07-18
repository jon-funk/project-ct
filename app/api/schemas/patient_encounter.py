from datetime import datetime
from typing import List
from pydantic import BaseModel


class PatientEncounterSchema(BaseModel):
    """
    An encounter with a given patient.
    """
    patient_rfid: str
    document_num: str
    location: str
    handover_from: str
    date: datetime
    arrival_time: datetime
    triage_acuity: str
    on_shift: bool
    chief_complaints: str
    arrival_method: str
    handover_too: str
    departure_time: datetime
    departure_dest: str
    comment: str
    qr_code: str
    document_num: str
    
    class Config:
        orm_mode = True

class PatientEncounterList(BaseModel):
    """
    A list of patient encounters.
    """
    patient_encounters: List[PatientEncounterSchema]

    class Config:
        orm_mode = True