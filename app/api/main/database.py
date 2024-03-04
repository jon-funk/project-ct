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
user = os.environ.get("POSTGRES_USER")
password = os.environ.get("POSTGRES_PASSWORD")
hostname = os.environ.get("POSTGRES_HOST")
user_sanctuary = os.environ.get("POSTGRES_SANCTUARY_USER")
pass_sanctuary = os.environ.get("POSTGRES_SANCTUARY_PASSWORD")
port = str(os.environ.get("POSTGRES_PORT"))
db_medical = os.environ.get("POSTGRES_DB")
db_sanctuary = os.environ.get("POSTGRES_SANCTUARY_DB")


if test:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://{user}:{password}@{hostname}:{port}/{db_medical}_test"
    )

    SQLALCHEMY_DATABASE_URL_SANCTUARY = f"postgresql+psycopg2://{user_sanctuary}:{pass_sanctuary}@{hostname}:{port}/{db_sanctuary}_test"
else:
    SQLALCHEMY_DATABASE_URL = (
        f"postgresql+psycopg2://{user}:{password}@{hostname}:{port}/{db_medical}"
    )

    # Define engine for the 'sanctuary' database
    SQLALCHEMY_DATABASE_URL_SANCTUARY = f"postgresql+psycopg2://{user_sanctuary}:{pass_sanctuary}@{hostname}:{port}/{db_sanctuary}"


engine_sanctuary = create_engine(SQLALCHEMY_DATABASE_URL_SANCTUARY)
SessionLocalSanctuary = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_sanctuary
)


# TODO: rename "example" database to medical
# Engine for the 'medical' database
engine_example = create_engine(SQLALCHEMY_DATABASE_URL)
if not database_exists(engine_example.url):  # Check if the db exists
    create_database(engine_example.url)  # Create new DB

# TODO: Rename sessionLocal to sessionLocalMedical
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_example)

# TODO: rename this to MedicalBase
Base = declarative_base()
BaseSanctuary = declarative_base()


def get_db_medical() -> Generator:
    db = SessionLocal()
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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_functions = {
    MEDICAL: get_db_medical,
    SANCTUARY: get_db_sanctuary,
}

def create_all_tables() -> None:
    Base.metadata.create_all(engine_example, checkfirst=True)
    BaseSanctuary.metadata.create_all(engine_sanctuary, checkfirst=True)


def drop_all_tables(check_first: bool = False) -> None:
    Base.metadata.drop_all(engine_example, checkfirst=check_first)
    BaseSanctuary.metadata.drop_all(engine_sanctuary, checkfirst=check_first)
