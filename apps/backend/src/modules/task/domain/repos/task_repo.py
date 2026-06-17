from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.task.domain.entities.task import Task


class TaskRepo(ABC):
    @abstractmethod
    async def create(self, task: Task) -> None:
        pass

    @abstractmethod
    async def list_by_project(self, project_id: UUID) -> list[Task]:
        pass

    async def get_by_id(self, task_id: UUID) -> Task:
        pass

    async def update(self, task: Task) -> None:
        pass
