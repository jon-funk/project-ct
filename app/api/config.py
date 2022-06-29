import os

from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).parent.absolute()


def load_env() -> None:
    """
    Load environment file into the current context. If a path
    to an environment file is not found, then use the env file
    found in the tests directory.
    """
    env_file = os.getenv("CT_ENV_PATH", (PROJECT_ROOT / "tests/test.env").as_posix())
    load_dotenv(dotenv_path=env_file)

