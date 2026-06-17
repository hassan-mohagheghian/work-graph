from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from src.modules.task.domain.value_objects.task_status import TaskStatus


@dataclass
class UpdateTaskCommand:
    org_id: UUID
    task_id: UUID
    user_id: UUID
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
