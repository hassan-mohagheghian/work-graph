from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus


@dataclass
class UpdateRoadmapCommand:
    org_id: UUID
    roadmap_id: UUID
    user_id: UUID
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[RoadmapStatus] = None
