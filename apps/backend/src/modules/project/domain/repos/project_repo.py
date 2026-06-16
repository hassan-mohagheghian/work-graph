from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.project.domain.entities.project import Project


class ProjectRepository(ABC):
    @abstractmethod
    async def create(self, project: Project) -> None:
        pass

    @abstractmethod
    async def get_by_id(self, project_id: UUID) -> Project | None:
        pass

    @abstractmethod
    async def list_by_org(self, org_id: UUID) -> list[Project]:
        pass
