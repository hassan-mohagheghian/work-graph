from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.planning.domain.entities.roadmap import Roadmap


class RoadmapRepo(ABC):
    @abstractmethod
    async def create(self, roadmap: Roadmap) -> None:
        pass

    @abstractmethod
    async def get_by_id(self, roadmap_id: UUID) -> Roadmap | None:
        pass

    @abstractmethod
    async def list_by_project(self, project_id: UUID) -> list[Roadmap]:
        pass

    @abstractmethod
    async def list_by_org(self, org_id: UUID) -> list[Roadmap]:
        pass

    @abstractmethod
    async def update(self, roadmap: Roadmap) -> None:
        pass

    @abstractmethod
    async def delete(self, roadmap_id: UUID) -> None:
        pass
