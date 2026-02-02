from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    user = relationship(
        "User",
        back_populates="project_memberships"
    )

    project = relationship(
        "Project",
        back_populates="members"
    )

    __table_args__ = (
        UniqueConstraint("user_id", "project_id", name="uq_user_project"),
    )
