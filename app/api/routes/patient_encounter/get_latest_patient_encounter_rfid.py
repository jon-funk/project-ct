import logging
from uuid import UUID
from typing import Any

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router

from api.main.auth import load_current_user
from api.main.database import get_db
from api.models.user import UserMedical as User
from api.models.patient_encounter import get_latest_patient_encounter_by_patient_rfid
from api.schemas.patient_encounter import PatientEncounterResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    "/latest-patient-encounter-rfid",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name="get-latest-patient-encounter-rfid",
)
def get_latest_patient_encounter_rfid(
    patient_rfid: str,
    loaded_user: User = Depends(load_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve a patient encounter from the database with the provided RFID.
    """
    try:
        encounter = get_latest_patient_encounter_by_patient_rfid(db, patient_rfid)
    except Exception as err:
        LOGGER.error(
            f"Server error while trying to get patient encounter: {err}",
        )
        return HTTPException(
            status_code=500,
            detail="Unable to get patient encounter at this time. Please try again later or contact support.",
        )

    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that RFID."
        )

    return PatientEncounterResponseSchema.from_orm(encounter)
