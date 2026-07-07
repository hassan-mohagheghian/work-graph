from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.planning.domain.entities.milestone import Milestone
from src.modules.planning.domain.repos.milestone_repo import MilestoneRepo
from src.modules.planning.infrastructure.persistence.models import MilestoneModel


class SqlAlchemyMilestoneRepo(MilestoneRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, milestone: Milestone) -> None:
        self.session.add(
            MilestoneModel(
                id=milestone.id,
                roadmap_id=milestone.roadmap_id,
                org_id=milestone.org_id,
                title=milestone.title,
                description=milestone.description,
                status=milestone.status.value,
                order=milestone.order,
                creator_id=milestone.creator_id,
                created_at=milestone.created_at,
            )
        )
        await self.session.commit()

    async def get_by_id(self, milestone_id: UUID) -> Milestone | None:
        result = await self.session.execute(
            select(MilestoneModel).where(MilestoneModel.id == milestone_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        return Milestone(
            id=model.id,
            roadmap_id=model.roadmap_id,
            org_id=model.org_id,
            title=model.title,
            description=model.description,
            status=model.status,
            order=model.order,
            creator_id=model.creator_id,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def list_by_roadmap(self, roadmap_id: UUID) -> list[Milestone]:
        result = await self.session.execute(
            select(MilestoneModel)
            .where(MilestoneModel.roadmap_id == roadmap_id)
            .order_by(MilestoneModel.order)
        )
        rows = result.scalars().all()
        return [
            Milestone(
                id=r.id,
                roadmap_id=r.roadmap_id,
                org_id=r.org_id,
                title=r.title,
                description=r.description,
                status=r.status,
                order=r.order,
                creator_id=r.creator_id,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in rows
        ]

    async def update(self, milestone: Milestone) -> None:
        result = await self.session.execute(
            select(MilestoneModel).where(MilestoneModel.id == milestone.id)
        )
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Milestone not found")

        model.title = milestone.title
        model.description = milestone.description
        model.status = milestone.status
        model.order = milestone.order
        await self.session.commit()

    async def delete(self, milestone_id: UUID) -> None:
        await self.session.execute(
            delete(MilestoneModel).where(MilestoneModel.id == milestone_id)
        )
        await self.session.commit()

    async def reorder(self, roadmap_id: UUID, ordered_ids: list[UUID]) -> None:
        for idx, milestone_id in enumerate(ordered_ids):
            result = await self.session.execute(
                select(MilestoneModel).where(
                    MilestoneModel.id == milestone_id,
                    MilestoneModel.roadmap_id == roadmap_id,
                )
            )
            model = result.scalar_one_or_none()
            if model:
                model.order = idx
        await self.session.commit()
