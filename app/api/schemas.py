from typing import List, Optional

from pydantic import BaseModel


class Example(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True