import logging

from fastapi import Depends, HTTPException

from sqlalchemy.orm import Session

from . import router
from api.constants import SANCTUARY

from api.main.database import get_db_sanctuary as get_db
from api.models.intake import get_latest_intake_by_guest_rfid
from api.schemas.intake import IntakeResponseSchema

LOGGER = logging.getLogger(__name__)


@router.get(
    f"/{SANCTUARY}/latest-form-rfid",
    status_code=200,
    response_model=IntakeResponseSchema,
    name=f"get-latest-{SANCTUARY}-rfid",
    tags=[SANCTUARY],
)
def get_latest_intake_rfid(
    guest_rfid: str,
    db: Session = Depends(get_db),
) -> IntakeResponseSchema:
    """
    Retrieve a intake from the database with the provided RFID.
    """
    try:
        intake = get_latest_intake_by_guest_rfid(db, guest_rfid)
    except Exception as err:
        LOGGER.error(
            f"Server error while trying to get intake: {err}",
        )
        raise HTTPException(
            status_code=500,
            detail="Unable to get intake at this time. Please try again later or contact support.",
        )

    if not intake:
        raise HTTPException(
            status_code=404, detail="Unable to find an entry with that RFID."
        )

    return IntakeResponseSchema.from_orm(intake)
