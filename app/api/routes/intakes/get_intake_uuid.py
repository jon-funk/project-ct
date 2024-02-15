import logging
from uuid import UUID

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from ...constants import SANCTUARY

from api.main.database import get_db_sanctuary as get_db
from api.models.intake import get_intake_by_uuid
from api.schemas.intake import IntakeResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    f"/{SANCTUARY}/form",
    status_code=200,
    response_model=IntakeResponseSchema,
    name=f"get-{SANCTUARY}-form",
    tags=[SANCTUARY],
)
def get_intake(
    uuid: UUID,
    db: Session = Depends(get_db),
) -> IntakeResponseSchema:
    """
    Retrieve a intake from the database with the provided UUID.
    """
    try:
        intake = get_intake_by_uuid(db, uuid)
    except Exception as err:
        LOGGER.error(
            f"Server error while trying to get intakes: {err}",
        )
        raise HTTPException(
            status_code=500,
            detail="Unable to get intakes at this time. Please try again later or contact support.",
        )

    if not intake:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    return IntakeResponseSchema.from_orm(intake)
