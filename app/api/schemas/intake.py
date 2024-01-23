from datetime import datetime
from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel


class IntakeSchema(BaseModel):
    """
    An intake for a given patient.
    """
    guest_rfid: Optional[str]
    arrival_date = Optional[DateTime]
    arrival_time = Optional[DateTime]
    arrival_method = Optional[String]
    identified_gender = Optional[String]
    first_visit = Optional[Boolean]
    presenting_complaint = Optional[String]
    guest_consciousness_level = Optional[String]
    guest_emotional_state = Optional[String]
    substance_categories = Optional[String]
    time_since_last_dose = Optional[Integer]
    discharge_date = Optional[DateTime]
    discharge_time = Optional[DateTime]
    discharge_method = Optional[String]


    class Config:
        orm_mode = True

class IntakeResponseSchema(IntakeSchema):
    """
    The intake response schema.
    """
    intake_uuid: Optional[UUID]

    class Config:
        orm_mode = True
