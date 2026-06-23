from sqlalchemy import Column, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.modules.task.domain.value_objects.task_status import TaskStatus
from src.modules.task.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import IDMixin, TimestampedMixin


class TaskModel(IDMixin, TimestampedMixin, Base):
    __table_args__ = {"schema": "task"}
    __tablename__ = "tasks"

    project_id = Column(PG_UUID(as_uuid=True), nullable=False)
    org_id = Column(PG_UUID(as_uuid=True), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    status = Column(
        SAEnum(TaskStatus, name="task_status"), default=TaskStatus.todo, nullable=False
    )
    assignee_id = Column(PG_UUID(as_uuid=True), nullable=True)
