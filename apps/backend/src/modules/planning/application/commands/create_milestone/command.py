from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateMilestoneCommand:
    org_id: UUID
    roadmap_id: UUID
    title: str
    description: str | None = None
    order: int = 0
    creator_id: UUID | None = None
