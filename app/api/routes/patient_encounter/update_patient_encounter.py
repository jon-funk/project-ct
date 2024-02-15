import logging

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from api.constants import MEDICAL

from api.main.database import get_db
from api.models.patient_encounter import (
    get_patient_encounter_by_uuid,
    update_patient_encounter,
)
from api.schemas.patient_encounter import (
    PatientEncounterResponseSchema,
)

LOGGER = logging.getLogger(__name__)


@router.put(
    f"/{MEDICAL}/form",
    status_code=200,
    response_model=PatientEncounterResponseSchema,
    name=f"update-{MEDICAL}-form",
    tags=[MEDICAL],
)
def update_encounter(
    data: PatientEncounterResponseSchema,
    db: Session = Depends(get_db),
) -> PatientEncounterResponseSchema:
    """
    Update a given patient encounter. In the event that a patient
    """
    try:
        encounter = get_patient_encounter_by_uuid(db, data.patient_encounter_uuid)
    except Exception as err:
        LOGGER.error(f"Server error while trying to retrieve patient encounter: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve patient encounter to update at this time. Please try again later or contact support.",
        )

    if not encounter:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    try:
        data_dict = data.dict()
        # Don't try and overwrite the patient_encounter_uuid
        data_dict.pop("patient_encounter_uuid")
        updated_encounter = update_patient_encounter(db, encounter, data_dict)
    except Exception as err:
        LOGGER.error(f"Server error while trying to update patient encounter: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to update patient encounter at this time. Please try again later or contact support.",
        )

    return PatientEncounterResponseSchema.from_orm(updated_encounter)
