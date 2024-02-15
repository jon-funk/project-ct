import logging

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from api.constants import SANCTUARY

from api.main.database import get_db_sanctuary as get_db
from api.models.intake import (
    get_intake_by_uuid,
    update_intake,
)
from api.schemas.intake import (
    IntakeResponseSchema,
)

LOGGER = logging.getLogger(__name__)


@router.put(
    f"/{SANCTUARY}/form",
    status_code=200,
    response_model=IntakeResponseSchema,
    name=f"update-{SANCTUARY}-form",
    tags=[SANCTUARY],
)
def update_intake(
    data: IntakeResponseSchema,
    db: Session = Depends(get_db),
) -> IntakeResponseSchema:
    """
    Update a given intake
    """
    try:
        intake = get_intake_by_uuid(db, data.intake_uuid)
    except Exception as err:
        LOGGER.error(f"Server error while trying to retrieve intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve intake to update at this time. Please try again later or contact support.",
        )

    if not intake:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    try:
        data_dict = data.dict()
        # Don't try and overwrite the intake_uuid
        data_dict.pop("intake_uuid")
        updated_intake = update_intake(db, intake, data_dict)
    except Exception as err:
        LOGGER.error(f"Server error while trying to update intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to update intake at this time. Please try again later or contact support.",
        )

    return IntakeResponseSchema.from_orm(updated_intake)
