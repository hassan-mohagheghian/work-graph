from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListTasksQuery:
    org_id: UUID
    project_id: UUID
    status: str | None
    limit: int = 10
    offset: int = 0
