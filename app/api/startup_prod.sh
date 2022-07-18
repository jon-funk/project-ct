# These commands are run in the context of a app engine environment and so have different paths
alembic upgrade head && uvicorn main.app:api --reload --host=0.0.0.0 --port=8080