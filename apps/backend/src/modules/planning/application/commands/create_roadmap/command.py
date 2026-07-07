from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateRoadmapCommand:
    org_id: UUID
    project_id: UUID
    title: str
    description: str | None = None
    creator_id: UUID | None = None
