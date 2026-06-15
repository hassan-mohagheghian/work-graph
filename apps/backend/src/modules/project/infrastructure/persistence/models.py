from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from src.modules.project.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import CreateAtMixin, UUIDMixin


class ProjectModel(UUIDMixin, CreateAtMixin, Base):
    __table_args__ = {"schema": "project"}
    __tablename__ = "projects"

    org_id = Column(PG_UUID(as_uuid=True), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(nullable=True)

    def __str__(self):
        return f"id={id}"
