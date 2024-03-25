from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class IntakeSchema(BaseModel):
    """
    An intake for a given patient.
    """

    document_num: Optional[str]
    guest_rfid: Optional[str]
    arrival_date: datetime
    arrival_time: datetime
    arrival_method: str
    identified_gender: Optional[str]
    first_visit: Optional[bool]
    presenting_complaint: str
    guest_consciousness_level: str
    guest_emotional_state: str
    substance_categories: str
    time_since_last_dose: Optional[int]
    discharge_date: datetime
    discharge_time: datetime
    discharge_method: Optional[str]
    comment: Optional[str]

    class Config:
        orm_mode = True


class IntakeResponseSchema(IntakeSchema):
    """
    The intake response schema.
    """

    intake_uuid: Optional[UUID]

    class Config:
        orm_mode = True
