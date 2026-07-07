from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetRoadmapQuery:
    roadmap_id: UUID
    org_id: UUID
