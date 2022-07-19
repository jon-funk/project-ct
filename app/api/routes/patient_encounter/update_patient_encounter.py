import logging
from typing import Any

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import User
from api.models.patient_encounter import get_patient_encounter_by_uuid
from api.schemas.patient_encounter import (
    PatientEncounterResponseSchema,
)

LOGGER = logging.getLogger(__name__)


@router.put(
    "/patient-encounter",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name="update-patient-encounter",
)
def update_patient_encounter(
    data: PatientEncounterResponseSchema,
    loaded_user: User = Depends(load_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a given patient encounter. In the event that a patient
    """
    encounter = get_patient_encounter_by_uuid(db, data.patient_encounter_uuid)
    LOGGER.error(f"UUID Value: {data.patient_encounter_uuid}")
    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    try:
        updated_encounter = update_patient_encounter(db, encounter, data.dict())
    except Exception as err:
        LOGGER.error(f"Server error while trying to update patient encounter: {err}")
        return HTTPException(
            status_code=500,
            detail="Unable to update patient encounter at this time. Please try again later or contact support.",
        )

    return PatientEncounterResponseSchema.from_orm(updated_encounter)
