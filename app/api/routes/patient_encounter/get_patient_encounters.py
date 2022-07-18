from fastapi import Depends

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import User
from api.models.patient_encounter import get_all_patient_encounters
from api.schemas.patient_encounter import PatientEncounterList


@router.get("/patient-encounters", status_code=200, response_model=PatientEncounterList, name="get-patient-encounters")
def get_patient_encounters(loaded_user: User = Depends(load_current_user), db: Session = Depends(get_db)) -> Any:
    """
    Retrieve all patient encounters from the database and return a list of patient encounters.
    """
    encounters = get_all_patient_encounters(db)
    return PatientEncounterList.from_orm(encounters)