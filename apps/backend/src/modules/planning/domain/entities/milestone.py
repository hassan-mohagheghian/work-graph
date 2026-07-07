from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.planning.domain.exceptions import InvalidMilestoneTransitionError
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
        if not self._can_transition(self.status, new_status):
            raise InvalidMilestoneTransitionError(self.status, new_status)
        self.status = new_status
        self.touch()

    def _can_transition(self, current: MilestoneStatus, new: MilestoneStatus) -> bool:
        allowed = {
            MilestoneStatus.pending: {MilestoneStatus.in_progress, MilestoneStatus.skipped},
            MilestoneStatus.in_progress: {MilestoneStatus.completed, MilestoneStatus.skipped},
            MilestoneStatus.completed: set(),
            MilestoneStatus.skipped: set(),
        }
        return new in allowed[current]
