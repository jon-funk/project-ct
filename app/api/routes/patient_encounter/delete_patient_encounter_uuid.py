import logging
from uuid import UUID

from fastapi import Depends, HTTPException, Response

from sqlalchemy.orm import Session

from . import router
from api.constants import MEDICAL


from api.main.database import get_db
from api.models.patient_encounter import (
    get_patient_encounter_by_uuid,
    soft_delete_patient_encounter,
)

LOGGER = logging.getLogger(__name__)


@router.delete(
    f"/{MEDICAL}/form",
    status_code=204,
    name=f"delete-{MEDICAL}-form",
    tags=[MEDICAL],
)
def delete_patient_encounter(
    uuid: UUID,
    db: Session = Depends(get_db),
) -> Response:
    """
    Delete a patient encounter with a given UUID.
    """
    try:
        encounter = get_patient_encounter_by_uuid(db, str(uuid))
    except Exception as err:
        LOGGER.error(f"Server error while trying to find patient encounter: {err}")
        raise HTTPException(
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
        raise HTTPException(
            status_code=500,
            detail="Unable to delete patient encounter at this time. Please try again later or contact support.",
        )

    return Response(status_code=204)
