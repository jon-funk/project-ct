from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel


class IntakeSchema(BaseModel):
    """
    An intake for a given patient.
    """

    guest_rfid: Optional[str] = None
    arrival_date: datetime
    arrival_time: datetime
    arrival_method: str
    identified_gender: Optional[str] = None
    first_visit: Optional[bool] = None
    presenting_complaint: str
    guest_consciousness_level: str
    guest_emotional_state: str
    substance_categories: str
    time_since_last_dose: Optional[int] = None
    discharge_date: datetime
    discharge_time: datetime
    discharge_method: Optional[str] = None

    class Config:
        orm_mode = True


class IntakeResponseSchema(IntakeSchema):
    """
    The intake response schema.
    """

    intake_uuid: UUID

    class Config:
        orm_mode = True
