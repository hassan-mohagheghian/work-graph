from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.task.domain.entities.task import Task
from src.modules.task.domain.repos.task_repo import TaskRepo
from src.modules.task.infrastructure.persistence.models import TaskModel


class SqlAlchemyTaskRepo(TaskRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, task: Task) -> None:
        self.session.add(
            TaskModel(
                id=task.id,
                project_id=task.project_id,
                org_id=task.org_id,
                title=task.title,
                description=task.description,
                status=task.status.value,
                created_at=task.created_at,
            )
        )
        await self.session.commit()

    async def get_by_id(self, task_id):
        result = await self.session.execute(
            select(TaskModel).where(TaskModel.id == task_id)
        )

        task = result.scalar_one_or_none()
        if not task:
            return None
        return Task(
            project_id=task.project_id,
            org_id=task.org_id,
            title=task.title,
            description=task.description,
            status=task.status,
            created_at=task.created_at,
            id=task.id,
        )

    async def list_by_project(self, project_id: UUID) -> list[Task]:
        result = await self.session.execute(
            select(TaskModel).where(TaskModel.project_id == project_id)
        )

        rows = result.scalars().all()

        return [
            Task(
                id=r.id,
                project_id=r.project_id,
                org_id=r.org_id,
                title=r.title,
                description=r.description,
                status=r.status,
                created_at=r.created_at,
            )
            for r in rows
        ]

    async def update(self, task: Task) -> None:
        result = await self.session.execute(
            select(TaskModel).where(TaskModel.id == task.id)
        )
        model = result.scalar_one_or_none()

        if not model:
            raise ValueError("Task not found")

        model.title = task.title
        model.description = task.description
        model.status = task.status

        await self.session.commit()
