from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus


@dataclass(eq=False)
class Roadmap(Entity, TimestampedMixin):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: RoadmapStatus = RoadmapStatus.draft
    creator_id: UUID | None = None

    def change_status(self, new_status: RoadmapStatus) -> None:
        self.status = new_status
        self.touch()
