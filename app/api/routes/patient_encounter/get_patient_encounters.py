import logging
from typing import Any, List

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import UserMedical as User
from api.models.patient_encounter import get_all_patient_encounters
from api.schemas.patient_encounter import PatientEncounterResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    "/patient-encounters",
    status_code=200,
    response_model=List[PatientEncounterResponseSchema],
    name="get-patient-encounters",
)
def get_patient_encounters(
    loaded_user: User = Depends(load_current_user), db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve all patient encounters from the database and return a list of patient encounters.
    """
    try:
        encounters = get_all_patient_encounters(db)
    except Exception as err:
        LOGGER.error(f"Server error while trying to get patient encounter: {err}")
        return HTTPException(
            status_code=500,
            detail="Unable to get patient encounter at this time. Please try again later or contact support.",
        )

    all_encounters = [PatientEncounterResponseSchema.from_orm(e) for e in encounters]

    return all_encounters
