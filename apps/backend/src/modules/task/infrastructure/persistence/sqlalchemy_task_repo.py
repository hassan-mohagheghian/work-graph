from uuid import UUID

from sqlalchemy import delete, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.planning.infrastructure.persistence.models import (
    MilestoneModel,
    RoadmapModel,
)
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
                milestone_id=task.milestone_id,
                order=task.order,
                created_at=task.created_at,
            )
        )
        await self.session.commit()

    async def delete(self, task_id) -> None:
        await self.session.execute(delete(TaskModel).where(TaskModel.id == task_id))
        await self.session.commit()

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
        model.milestone_id = task.milestone_id

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
            milestone_id=task.milestone_id,
            order=task.order,
            created_at=task.created_at,
            id=task.id,
        )

    async def list_by_project(self, project_id: UUID) -> list[Task]:
        result = await self.session.execute(
            select(TaskModel)
            .where(TaskModel.project_id == project_id)
            .order_by(TaskModel.order)
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
                milestone_id=r.milestone_id,
                order=r.order,
                created_at=r.created_at,
            )
            for r in rows
        ]

    async def list(
        self, org_id, project_id, status=None, limit=10, offset=0
    ) -> list[Task]:
        stmt = select(TaskModel).where(TaskModel.org_id == org_id)
        if project_id:
            stmt = stmt.where(TaskModel.project_id == project_id)

        if status:
            stmt = stmt.where(TaskModel.status == status)

        stmt = stmt.order_by(TaskModel.order)
        stmt = stmt.limit(limit=limit).offset(offset=offset)

        result = await self.session.execute(stmt)
        rows = result.scalars().all()
        return [
            Task(
                project_id=row.project_id,
                org_id=row.org_id,
                title=row.title,
                description=row.description,
                status=row.status,
                milestone_id=row.milestone_id,
                order=row.order,
                created_at=row.created_at,
                updated_at=row.updated_at,
                id=row.id,
            )
            for row in rows
        ]

    async def list_with_details(
        self, org_id, project_id, status=None, limit=10, offset=0
    ) -> list[tuple[Task, str | None, str | None]]:
        stmt = (
            select(
                TaskModel,
                RoadmapModel.title.label("roadmap_title"),
                MilestoneModel.title.label("milestone_title"),
            )
            .outerjoin(MilestoneModel, TaskModel.milestone_id == MilestoneModel.id)
            .outerjoin(RoadmapModel, MilestoneModel.roadmap_id == RoadmapModel.id)
            .where(TaskModel.org_id == org_id)
        )

        if project_id:
            stmt = stmt.where(TaskModel.project_id == project_id)

        if status:
            stmt = stmt.where(TaskModel.status == status)

        stmt = stmt.order_by(TaskModel.order)
        stmt = stmt.limit(limit=limit).offset(offset=offset)

        result = await self.session.execute(stmt)
        rows = result.all()

        return [
            (
                Task(
                    id=row[0].id,
                    project_id=row[0].project_id,
                    org_id=row[0].org_id,
                    title=row[0].title,
                    description=row[0].description,
                    status=row[0].status,
                    milestone_id=row[0].milestone_id,
                    order=row[0].order,
                    created_at=row[0].created_at,
                    updated_at=row[0].updated_at,
                ),
                row[1],
                row[2],
            )
            for row in rows
        ]

    async def reorder(self, project_id: UUID, ordered_ids: list[UUID]) -> None:
        for idx, task_id in enumerate(ordered_ids):
            result = await self.session.execute(
                select(TaskModel).where(
                    TaskModel.id == task_id,
                    TaskModel.project_id == project_id,
                )
            )
            model = result.scalar_one_or_none()
            if model:
                model.order = idx
        await self.session.commit()
