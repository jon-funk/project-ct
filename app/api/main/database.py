import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

from api.constants import MEDICAL, SANCTUARY
from api.config import load_env


load_env()
test = os.environ.get("IS_TEST")
user_medical = os.environ.get("POSTGRES_MEDICAL_USER")
password_medical = os.environ.get("POSTGRES_MEDICAL_PASSWORD")
hostname = os.environ.get("POSTGRES_HOST")
user_sanctuary = os.environ.get("POSTGRES_SANCTUARY_USER")
pass_sanctuary = os.environ.get("POSTGRES_SANCTUARY_PASSWORD")
port = str(os.environ.get("POSTGRES_PORT"))
db_medical = os.environ.get("POSTGRES_MEDICAL_DB")
db_sanctuary = os.environ.get("POSTGRES_SANCTUARY_DB")


if test:
    SQLALCHEMY_DATABASE_URL_MEDICAL = f"postgresql+psycopg2://{user_medical}:{password_medical}@{hostname}:{port}/{db_medical}_test"

    SQLALCHEMY_DATABASE_URL_SANCTUARY = f"postgresql+psycopg2://{user_sanctuary}:{pass_sanctuary}@{hostname}:{port}/{db_sanctuary}_test"
else:
    SQLALCHEMY_DATABASE_URL_MEDICAL = f"postgresql+psycopg2://{user_medical}:{password_medical}@{hostname}:{port}/{db_medical}"

    # Define engine for the 'sanctuary' database
    SQLALCHEMY_DATABASE_URL_SANCTUARY = f"postgresql+psycopg2://{user_sanctuary}:{pass_sanctuary}@{hostname}:{port}/{db_sanctuary}"


engine_sanctuary = create_engine(SQLALCHEMY_DATABASE_URL_SANCTUARY)
if not database_exists(engine_sanctuary.url):  # Check if the db exists
    create_database(engine_sanctuary.url)  # Create new DB
SessionLocalSanctuary = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_sanctuary
)


engine_medical = create_engine(SQLALCHEMY_DATABASE_URL_MEDICAL)
if not database_exists(engine_medical.url):  # Check if the db exists
    create_database(engine_medical.url)  # Create new DB

SessionLocalMedical = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_medical
)

BaseMedical = declarative_base()
BaseSanctuary = declarative_base()


def get_db_medical() -> Generator:
    db = SessionLocalMedical()
    try:
        yield db
    finally:
        db.close()


def get_db_sanctuary() -> Generator:
    db = SessionLocalSanctuary()
    try:
        yield db
    finally:
        db.close()


# TODO: Replace all instances of get_db with get_db medical
def get_db() -> Generator:
    db = SessionLocalMedical()
    try:
        yield db
    finally:
        db.close()


db_functions = {
    MEDICAL: get_db_medical,
    SANCTUARY: get_db_sanctuary,
}


def create_all_tables() -> None:
    BaseMedical.metadata.create_all(engine_medical, checkfirst=True)
    BaseSanctuary.metadata.create_all(engine_sanctuary, checkfirst=True)


def drop_all_tables(check_first: bool = False) -> None:
    BaseMedical.metadata.drop_all(engine_medical, checkfirst=check_first)
    BaseSanctuary.metadata.drop_all(engine_sanctuary, checkfirst=check_first)
