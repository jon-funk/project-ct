from typing import Any

from fastapi import Depends

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import User
from api.models.patient_encounter import create_patient_encounter, PatientEncounter
from api.schemas.patient_encounter import PatientEncounterSchema


@router.post("/create-patient-encounter", status_code=200, response_model=PatientEncounterSchema, name="create-patient-encounter")
def post_patient_encounter(data: PatientEncounterSchema, loaded_user: User = Depends(load_current_user), db: Session = Depends(get_db)) -> Any:
    """
    Retrieve all patient encounters from the database and return a list of patient encounters.
    """
    new_encounter = PatientEncounter(**dict(data))
    encounter = create_patient_encounter(db, new_encounter)
    return PatientEncounterSchema.from_orm(encounter)