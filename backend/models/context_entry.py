from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class ContextEntry(Base):
    __tablename__ = "context_entries"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    project = relationship(
        "Project",
        back_populates="context_entries"
    )
