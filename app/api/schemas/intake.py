from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class IntakeSchema(BaseModel):
    """
    An intake for a given patient.
    """

    guest_rfid: Optional[str] = None
    arrival_date: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    arrival_method: Optional[str] = None
    identified_gender: Optional[str] = None
    first_visit: Optional[bool] = None
    presenting_complaint: Optional[str] = None
    guest_consciousness_level: Optional[str] = None
    guest_emotional_state: Optional[str] = None
    substance_categories: Optional[str] = None
    time_since_last_dose: Optional[int] = None
    discharge_date: Optional[datetime] = None
    discharge_time: Optional[datetime] = None
    discharge_method: Optional[str] = None

    class Config:
        orm_mode = True


class IntakeResponseSchema(IntakeSchema):
    """
    The intake response schema.
    """

    intake_uuid: Optional[UUID] = None

    class Config:
        orm_mode = True
