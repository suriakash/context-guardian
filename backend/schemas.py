
from pydantic import BaseModel
from typing import Optional

from datetime import datetime

# ---------- USERS ----------

class UserCreate(BaseModel):
    email: str
    full_name: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


# ---------- PROJECTS ----------

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ---------- CONTEXTS ----------

class ContextCreate(BaseModel):
    content: str
    project_id: int


class ContextEntryOut(BaseModel):
    id: int
    content: str
    project_id: int

    class Config:
        from_attributes = True
