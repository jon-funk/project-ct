from fastapi import APIRouter

router = APIRouter()

from . import get_patient_encounter
from . import get_patient_encounters
from . import submit_patient_encounter
from . import delete_patient_encounter
from . import update_patient_encounter
