import logging
from uuid import UUID

from fastapi import Depends, HTTPException, Response

from sqlalchemy.orm import Session

from . import router
from api.constants import SANCTUARY

from api.main.database import get_db_sanctuary as get_db
from api.models.intake import (
    get_intake_by_uuid,
    soft_delete_intake,
)

LOGGER = logging.getLogger(__name__)


@router.delete(
    f"/{SANCTUARY}/form",
    status_code=204,
    name=f"delete-{SANCTUARY}-form",
    tags=[SANCTUARY],
)
def delete_intake(
    uuid: UUID,
    db: Session = Depends(get_db),
) -> Response:
    """
    Delete a intake with a given UUID.
    """
    try:
        intake = get_intake_by_uuid(db, str(uuid))
    except Exception as err:
        LOGGER.error(f"Server error while trying to find intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to find that intake at this time. Please try again later or contact support.",
        )

    if not intake:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that document id."
        )

    try:
        soft_delete_intake(db, str(uuid))
    except Exception as err:
        LOGGER.error(f"Server error while trying to delete intake: {err}")
        raise HTTPException(
            status_code=500,
            detail="Unable to delete intake at this time. Please try again later or contact support.",
        )

    return Response(status_code=204)
