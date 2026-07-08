from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.task.domain.value_objects.task_status import TaskStatus


@dataclass(eq=False)
class Task(Entity, TimestampedMixin):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.todo
    creator_id: UUID | None = None
    assignee_id: UUID | None = None
    milestone_id: UUID | None = None
    order: int = 0

    def change_status(self, new_status: TaskStatus) -> None:
        self.status = new_status
        self.touch()

    def assign(self, user_id: UUID | None) -> None:
        self.assignee_id = user_id
        self.touch()
