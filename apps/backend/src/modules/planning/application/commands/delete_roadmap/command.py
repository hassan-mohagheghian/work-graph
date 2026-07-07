from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteRoadmapCommand:
    roadmap_id: UUID
    org_id: UUID
    user_id: UUID
