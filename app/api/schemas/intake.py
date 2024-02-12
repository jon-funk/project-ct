from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class IntakeSchema(BaseModel):
    """
    An intake for a given patient.
    """
    guest_rfid: Optional[str]
    arrival_date = Optional[datetime]
    arrival_time = Optional[datetime]
    arrival_method = Optional[str]
    identified_gender = Optional[str]
    first_visit = Optional[bool]
    presenting_complaint = Optional[str]
    guest_consciousness_level = Optional[str]
    guest_emotional_state = Optional[str]
    substance_categories = Optional[str]
    time_since_last_dose = Optional[int]
    discharge_date = Optional[datetime]
    discharge_time = Optional[datetime]
    discharge_method = Optional[str]


    class Config:
        orm_mode = True

class IntakeResponseSchema(IntakeSchema):
    """
    The intake response schema.
    """
    intake_uuid: Optional[UUID]

    class Config:
        orm_mode = True
