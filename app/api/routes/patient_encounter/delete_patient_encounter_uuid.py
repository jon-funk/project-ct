import logging
from typing import Any
from uuid import UUID

from fastapi import Depends, HTTPException, Response

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import User
from api.models.patient_encounter import PatientEncounter
from api.models.patient_encounter import (
    get_patient_encounter_by_uuid,
    soft_delete_patient_encounter,
)
from api.schemas.patient_encounter import PatientEncounterSchema

LOGGER = logging.getLogger(__name__)


@router.delete(
    "/patient-encounter",
    status_code=204,
    name="get-patient-encounter",
)
def delete_patient_encounter(
    uuid: UUID,
    loaded_user: User = Depends(load_current_user),
    db: Session = Depends(get_db),
) -> Response:
    """
    Delete a patient encounter with a given UUID.
    """
    try:
        encounter = get_patient_encounter_by_uuid(db, str(uuid))
    except Exception as err:
        LOGGER.error(f"Server error while trying to find patient encounter: {err}")
        return HTTPException(
            status_code=500,
            detail="Unable to find that patient encounter at this time. Please try again later or contact support.",
        )

    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    try:
        soft_delete_patient_encounter(db, str(uuid))
    except Exception as err:
        LOGGER.error(f"Server error while trying to delete patient encounter: {err}")
        return HTTPException(
            status_code=500,
            detail="Unable to delete patient encounter at this time. Please try again later or contact support.",
        )

    return Response(status_code=204)
