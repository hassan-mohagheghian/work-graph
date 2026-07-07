from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.planning.domain.entities.milestone import Milestone


class MilestoneRepo(ABC):
    @abstractmethod
    async def create(self, milestone: Milestone) -> None:
        pass

    @abstractmethod
    async def get_by_id(self, milestone_id: UUID) -> Milestone | None:
        pass

    @abstractmethod
    async def list_by_roadmap(self, roadmap_id: UUID) -> list[Milestone]:
        pass

    @abstractmethod
    async def update(self, milestone: Milestone) -> None:
        pass

    @abstractmethod
    async def delete(self, milestone_id: UUID) -> None:
        pass

    @abstractmethod
    async def reorder(self, roadmap_id: UUID, ordered_ids: list[UUID]) -> None:
        pass
