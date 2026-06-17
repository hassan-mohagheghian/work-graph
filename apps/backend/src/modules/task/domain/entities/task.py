from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity
from src.modules.task.domain.exceptions import InvalidTaskTransitionError
from src.modules.task.domain.value_objects.task_status import TaskStatus


@dataclass(eq=False)
class Task(Entity):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.todo
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def change_status(self, new_status: TaskStatus) -> None:
        """_summary_
        Raises:
            - InvalidTaskTransitionError
        """
        if not self._can_transition(self.status, new_status):
            raise InvalidTaskTransitionError(current=self.status, target=new_status)

        self.status = new_status

    def _can_transition(self, current: TaskStatus, new: TaskStatus) -> bool:
        allowed = {
            TaskStatus.todo: {TaskStatus.in_progress},
            TaskStatus.in_progress: {TaskStatus.done},
            TaskStatus.done: set(),
        }

        return new in allowed[current]
