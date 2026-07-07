from dataclasses import dataclass
from uuid import UUID


@dataclass
class ActivateRoadmapCommand:
    roadmap_id: UUID
    org_id: UUID
    user_id: UUID
