import os
from typing import List
import logging
from xml.sax.saxutils import prepare_input_source

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from api import routes, constants

API_PREFIX = os.getenv("API_PREFIX")

fe_origin = os.environ.get("FRONTEND_ORIGIN")
protocol = os.environ.get("PROTOCOL")

origins = [
    f"{protocol}://{fe_origin}",
]

api = FastAPI(
    title=constants.API_TITLE,
    description=constants.API_DESCRIPTION,
    version=constants.API_VERSION,
    docs_url=f"{API_PREFIX}/docs",
    redoc_url=f"{API_PREFIX}/redoc",
    openapi_url=f"{API_PREFIX}/openapi.json",
    description=constants.API_DESCRIPTION,
    version=constants.API_VERSION
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(routes.login.router, prefix=API_PREFIX)
api.include_router(routes.register.router, prefix=API_PREFIX)
api.include_router(routes.refresh_token.router, prefix=API_PREFIX)
api.include_router(routes.patient_encounter.router, prefix=API_PREFIX)

# TODO: Implement health model with intelligent checks
@api.get(f"{API_PREFIX}/health")
@api.get(f"{API_PREFIX}/")
def health_check():
    health_msg = {"status": "healthy"}
    return health_msg
