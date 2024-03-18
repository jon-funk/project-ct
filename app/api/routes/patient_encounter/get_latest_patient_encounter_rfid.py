import logging

from fastapi import Depends, HTTPException, Request

from sqlalchemy.orm import Session

from . import router
from api.constants import MEDICAL

from api.main.database import get_db
from api.models.patient_encounter import get_latest_patient_encounter_by_patient_rfid
from api.schemas.patient_encounter import PatientEncounterResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    f"/{MEDICAL}/latest-form-rfid",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name=f"get-latest-{MEDICAL}-form-rfid",
    tags=[MEDICAL],
)
def get_latest_patient_encounter_rfid(
    request: Request,
    db: Session = Depends(get_db),
) -> PatientEncounterResponseSchema:
    """
    Retrieve a patient encounter from the database with the provided RFID.
    """
    patient_rfid = request.headers.get('patient_rfid')  

    try:
        encounter = get_latest_patient_encounter_by_patient_rfid(db, patient_rfid)
    except Exception as err:
        LOGGER.error(
            f"Server error while trying to get patient encounter: {err}",
        )
        raise HTTPException(
            status_code=500,
            detail="Unable to get patient encounter at this time. Please try again later or contact support.",
        )

    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that RFID."
        )

    return PatientEncounterResponseSchema.from_orm(encounter)
