from fastapi import APIRouter

router = APIRouter()

from . import get_latest_intake_rfid
from . import get_intake_uuid
from . import get_intakes
from . import submit_intake
from . import delete_intake_uuid
from . import update_intake
