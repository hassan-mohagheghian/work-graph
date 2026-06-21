from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.task.domain.entities.task import Task


class TaskRepo(ABC):
    @abstractmethod
    async def create(self, task: Task) -> None:
        pass

    @abstractmethod
    async def delete(self, task_id: UUID) -> None:
        pass

    @abstractmethod
    async def list_by_project(self, project_id: UUID) -> list[Task]:
        pass

    @abstractmethod
    async def get_by_id(self, task_id: UUID) -> Task:
        pass

    @abstractmethod
    async def update(self, task: Task) -> None:
        pass

    @abstractmethod
    async def list(
        self,
        org_id: UUID,
        project_id: UUID,
        status: str | None = None,
        limit: int | None = 10,
        offset: int | None = 0,
    ):
        pass
