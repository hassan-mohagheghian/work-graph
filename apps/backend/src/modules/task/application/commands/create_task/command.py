from dataclasses import dataclass
from uuid import UUID

from src.modules.task.domain.value_objects.task_status import TaskStatus


@dataclass
class CreateTaskCommand:
    org_id: UUID
    project_id: UUID
    title: str
    description: str | None = None
    milestone_id: UUID | None = None
    status: TaskStatus = TaskStatus.todo
