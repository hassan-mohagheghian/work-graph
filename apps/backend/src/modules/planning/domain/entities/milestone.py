from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.planning.domain.value_objects.milestone_status import MilestoneStatus


@dataclass(eq=False)
class Milestone(Entity, TimestampedMixin):
    roadmap_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: MilestoneStatus = MilestoneStatus.pending
    order: int = 0
    creator_id: UUID | None = None

    def change_status(self, new_status: MilestoneStatus) -> None:
        self.status = new_status
        self.touch()
