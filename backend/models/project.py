from sqlalchemy import Column, String, DateTime
from database import Base
import datetime

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    owner_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
