import logging
from uuid import UUID
from typing import Any

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import UserMedical as User
from api.models.patient_encounter import get_patient_encounter_by_uuid
from api.schemas.patient_encounter import PatientEncounterResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    "/patient-encounter",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name="get-patient-encounter",
)
def get_patient_encounter(
    uuid: UUID,
    db: Session = Depends(get_db),
) -> PatientEncounterResponseSchema:
    """
    Retrieve a patient encounter from the database with the provided UUID.
    """
    try:
        encounter = get_patient_encounter_by_uuid(db, uuid)
    except Exception as err:
        LOGGER.error(
            f"Server error while trying to get patient encounters: {err}",
        )
        raise HTTPException(
            status_code=500,
            detail="Unable to get patient encounters at this time. Please try again later or contact support.",
        )

    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    return PatientEncounterResponseSchema.from_orm(encounter)
