import logging

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from api.constants import MEDICAL

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import UserMedical as User
from api.models.patient_encounter import create_patient_encounter, PatientEncounter
from api.schemas.patient_encounter import (
    PatientEncounterSchema,
    PatientEncounterResponseSchema,
)

LOGGER = logging.getLogger(__name__)


@router.post(
    f"/{MEDICAL}/form",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name=f"create-{MEDICAL}-form",
    tags=[MEDICAL],
)
def post_patient_encounter(
    data: PatientEncounterSchema,
    loaded_user: User = Depends(load_current_user),
    db: Session = Depends(get_db),
) -> PatientEncounterResponseSchema:
    """
    Create a new patient encounter.
    """
    new_encounter = PatientEncounter(**dict(data))
    new_encounter.user_uuid = loaded_user.user_uuid
    try:
        encounter = create_patient_encounter(db, new_encounter)
    except Exception as err:
        LOGGER.error(f"Server error while trying to create patient encounter: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to create patient encounter at this time. Please try again later or contact support.",
        )

    return PatientEncounterResponseSchema.from_orm(encounter)
