from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity
from src.modules.task.domain.value_objects.task_status import TaskStatus


@dataclass(eq=False)
class Task(Entity):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


ALLOWED_TRANSITIONS = {
    TaskStatus.TODO: {TaskStatus.IN_PROGRESS},
    TaskStatus.IN_PROGRESS: {TaskStatus.DONE},
    TaskStatus.DONE: set(),
}
