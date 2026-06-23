from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.task.domain.exceptions import InvalidTaskTransitionError
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

    def change_status(self, new_status: TaskStatus) -> None:
        """
        Raises:
            - InvalidTaskTransitionError
        """
        if not self._can_transition(self.status, new_status):
            raise InvalidTaskTransitionError(current=self.status, target=new_status)

        self.status = new_status
        self.touch()

    def _can_transition(self, current: TaskStatus, new: TaskStatus) -> bool:
        allowed = {
            TaskStatus.todo: {TaskStatus.in_progress},
            TaskStatus.in_progress: {TaskStatus.done},
            TaskStatus.done: set(),
        }

        return new in allowed[current]

    def assign(self, user_id: UUID | None) -> None:
        self.assignee_id = user_id
        self.touch
