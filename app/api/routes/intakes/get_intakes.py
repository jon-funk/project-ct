import logging
from typing import List, Optional

from fastapi import Depends, HTTPException, Query

from sqlalchemy.orm import Session

from . import router
from ...constants import SANCTUARY

from api.main.database import get_db_sanctuary as get_db
from api.models.intake import get_all_intakes
from api.schemas.intake import IntakeResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    f"/{SANCTUARY}/form",
    status_code=200,
    response_model=List[IntakeResponseSchema],
    name=f"get-{SANCTUARY}-form",
    tags=[SANCTUARY],
)
def get_intakes(
    db: Session = Depends(get_db),
    arrival_date_min: Optional[str] = Query(
        None, description="The start date of the intake(s) to retrieve."
    ),
    arrival_date_max: Optional[str] = Query(
        None, description="The end date of the intake(s) to retrieve."
    ),
) -> List[IntakeResponseSchema]:
    """
    Retrieve all intakes from the database and return a list of intakes.

    If you want to filter the intakes by arrival date, you can provide the `arrival_date_min` and `arrival_date_max` query parameters.

    If you provide the `arrival_date_min` and `arrival_date_max` query parameters, the API will return all intakes that have an arrival date between the `arrival_date_min` and `arrival_date_max` inclusive.

    If you do not provide the `arrival_date_min` and `arrival_date_max` query parameters, the API will return all intakes.

    If you provide the `arrival_date_min` query parameter and do not provide the `arrival_date_max` query parameter, the API will return all intakes that have an arrival date on or after the `arrival_date_min`.

    If you provide the `arrival_date_max` query parameter and do not provide the `arrival_date_min` query parameter, the API will return all intakes that have an arrival date on or before the `arrival_date_max`.
    """
    try:
        intakes = get_all_intakes(db, arrival_date_min, arrival_date_max)
    except Exception as err:
        LOGGER.error(f"Server error while trying to get intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to get intake at this time. Please try again later or contact support.",
        )

    all_intakes = [IntakeResponseSchema.from_orm(e) for e in intakes]

    return all_intakes
