from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class TaskResponse:
    id: UUID
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None
    status: str
    created_at: datetime


@dataclass
class TaskListResponse:
    items: list[TaskResponse]
