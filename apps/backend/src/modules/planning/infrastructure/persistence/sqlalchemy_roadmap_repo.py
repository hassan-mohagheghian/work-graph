from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.planning.domain.entities.roadmap import Roadmap
from src.modules.planning.domain.repos.roadmap_repo import RoadmapRepo
from src.modules.planning.infrastructure.persistence.models import RoadmapModel


class SqlAlchemyRoadmapRepo(RoadmapRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, roadmap: Roadmap) -> None:
        self.session.add(
            RoadmapModel(
                id=roadmap.id,
                project_id=roadmap.project_id,
                org_id=roadmap.org_id,
                title=roadmap.title,
                description=roadmap.description,
                status=roadmap.status.value,
                creator_id=roadmap.creator_id,
                created_at=roadmap.created_at,
            )
        )
        await self.session.commit()

    async def get_by_id(self, roadmap_id: UUID) -> Roadmap | None:
        result = await self.session.execute(
            select(RoadmapModel).where(RoadmapModel.id == roadmap_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        return Roadmap(
            id=model.id,
            project_id=model.project_id,
            org_id=model.org_id,
            title=model.title,
            description=model.description,
            status=model.status,
            creator_id=model.creator_id,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def list_by_project(self, project_id: UUID) -> list[Roadmap]:
        result = await self.session.execute(
            select(RoadmapModel).where(RoadmapModel.project_id == project_id)
        )
        rows = result.scalars().all()
        return [
            Roadmap(
                id=r.id,
                project_id=r.project_id,
                org_id=r.org_id,
                title=r.title,
                description=r.description,
                status=r.status,
                creator_id=r.creator_id,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in rows
        ]

    async def list_by_org(self, org_id: UUID) -> list[Roadmap]:
        result = await self.session.execute(
            select(RoadmapModel).where(RoadmapModel.org_id == org_id)
        )
        rows = result.scalars().all()
        return [
            Roadmap(
                id=r.id,
                project_id=r.project_id,
                org_id=r.org_id,
                title=r.title,
                description=r.description,
                status=r.status,
                creator_id=r.creator_id,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in rows
        ]

    async def update(self, roadmap: Roadmap) -> None:
        result = await self.session.execute(
            select(RoadmapModel).where(RoadmapModel.id == roadmap.id)
        )
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Roadmap not found")

        model.title = roadmap.title
        model.description = roadmap.description
        model.status = roadmap.status
        await self.session.commit()

    async def delete(self, roadmap_id: UUID) -> None:
        await self.session.execute(
            delete(RoadmapModel).where(RoadmapModel.id == roadmap_id)
        )
        await self.session.commit()
