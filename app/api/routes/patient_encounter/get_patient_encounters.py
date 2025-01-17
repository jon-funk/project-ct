import logging
from typing import List, Optional

from fastapi import Depends, HTTPException, Query

from sqlalchemy.orm import Session

from . import router
from api.constants import MEDICAL

from api.main.database import get_db
from api.models.patient_encounter import get_all_patient_encounters
from api.schemas.patient_encounter import PatientEncounterResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    f"/{MEDICAL}/forms",
    status_code=200,
    response_model=List[PatientEncounterResponseSchema],
    name="get-{MEDCIAL}-forms",
    tags=[MEDICAL],
)
def get_patient_encounters(
    db: Session = Depends(get_db),
    arrival_date_min: Optional[str] = Query(
        None, description="The start date of the patient encounter(s) to retrieve."
    ),
    arrival_date_max: Optional[str] = Query(
        None, description="The end date of the patient encounter(s) to retrieve."
    ),
) -> List[PatientEncounterResponseSchema]:
    """
    Retrieve all patient encounters from the database and return a list of patient encounters.

    If you want to filter the patient encounters by arrival date, you can provide the `arrival_date_min` and `arrival_date_max` query parameters.

    If you provide the `arrival_date_min` and `arrival_date_max` query parameters, the API will return all patient encounters that have an arrival date between the `arrival_date_min` and `arrival_date_max` inclusive.

    If you do not provide the `arrival_date_min` and `arrival_date_max` query parameters, the API will return all patient encounters.

    If you provide the `arrival_date_min` query parameter and do not provide the `arrival_date_max` query parameter, the API will return all patient encounters that have an arrival date on or after the `arrival_date_min`.

    If you provide the `arrival_date_max` query parameter and do not provide the `arrival_date_min` query parameter, the API will return all patient encounters that have an arrival date on or before the `arrival_date_max`.
    """
    try:
        encounters = get_all_patient_encounters(db, arrival_date_min, arrival_date_max)
    except Exception as err:
        LOGGER.error(f"Server error while trying to get patient encounter: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to get patient encounter at this time. Please try again later or contact support.",
        )

    all_encounters = [PatientEncounterResponseSchema.from_orm(e) for e in encounters]

    return all_encounters
