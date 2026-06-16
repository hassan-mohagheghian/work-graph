import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from src.modules.task.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import CreateAtMixin, IDMixin


class TaskModel(IDMixin, CreateAtMixin, Base):
    __table_args__ = {"schema": "task"}
    __tablename__ = "tasks"

    project_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), unique=True, nullable=False)
    description: Mapped[str | None]
    status: Mapped[str] = mapped_column(String(50), default="todo")
