from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.project.domain.entities.project_membership import ProjectMembership


class ProjectMembershipRepo(ABC):
    @abstractmethod
    async def add(self, membership: ProjectMembership):
        pass

    @abstractmethod
    async def get_role(self, project_id: UUID, user_id: UUID) -> str:
        pass

    @abstractmethod
    async def list_by_project(self, project_id: UUID) -> list[ProjectMembership]:
        pass

    @abstractmethod
    async def exists(self, project_id: UUID, user_id: UUID) -> bool:
        pass

    @abstractmethod
    async def update_role(self, project_id: UUID, user_id: UUID, role: str):
        pass

    @abstractmethod
    async def remove(self, project_id: UUID, user_id: UUID):
        pass
