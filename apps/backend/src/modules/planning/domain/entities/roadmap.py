from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin
from src.modules.planning.domain.exceptions import InvalidRoadmapTransitionError
from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus


@dataclass(eq=False)
class Roadmap(Entity, TimestampedMixin):
    project_id: UUID
    org_id: UUID
    title: str
    description: str | None = None
    status: RoadmapStatus = RoadmapStatus.draft
    creator_id: UUID | None = None

    def activate(self) -> None:
        if not self._can_transition(self.status, RoadmapStatus.active):
            raise InvalidRoadmapTransitionError(self.status, RoadmapStatus.active)
        self.status = RoadmapStatus.active
        self.touch()

    def complete(self) -> None:
        if not self._can_transition(self.status, RoadmapStatus.completed):
            raise InvalidRoadmapTransitionError(self.status, RoadmapStatus.completed)
        self.status = RoadmapStatus.completed
        self.touch()

    def archive(self) -> None:
        if not self._can_transition(self.status, RoadmapStatus.archived):
            raise InvalidRoadmapTransitionError(self.status, RoadmapStatus.archived)
        self.status = RoadmapStatus.archived
        self.touch()

    def change_status(self, new_status: RoadmapStatus) -> None:
        if not self._can_transition(self.status, new_status):
            raise InvalidRoadmapTransitionError(self.status, new_status)
        self.status = new_status
        self.touch()

    def _can_transition(self, current: RoadmapStatus, new: RoadmapStatus) -> bool:
        allowed = {
            RoadmapStatus.draft: {RoadmapStatus.active},
            RoadmapStatus.active: {RoadmapStatus.completed, RoadmapStatus.archived},
            RoadmapStatus.completed: {RoadmapStatus.archived},
            RoadmapStatus.archived: set(),
        }
        return new in allowed[current]
