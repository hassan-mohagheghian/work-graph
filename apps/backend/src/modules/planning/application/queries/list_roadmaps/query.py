from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListRoadmapsQuery:
    org_id: UUID
    project_id: UUID | None = None
    status: str | None = None
    limit: int = 20
    offset: int = 0
