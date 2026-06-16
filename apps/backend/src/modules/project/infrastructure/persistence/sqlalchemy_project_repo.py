from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.project.domain.entities.project import Project
from src.modules.project.domain.repos.project_repo import ProjectRepository
from src.modules.project.infrastructure.persistence.models import ProjectModel


class SqlAlchemyProjectRepo(ProjectRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, project: Project) -> None:
        self.session.add(
            ProjectModel(
                id=project.id,
                org_id=project.org_id,
                name=project.name,
                description=project.description,
                created_at=project.created_at,
            )
        )
        await self.session.commit()

    async def get_by_id(self, project_id: UUID) -> Project | None:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.id == project_id)
        )
        project = result.scalar_one_or_none()

        return project and Project(
            org_id=project.org_id,
            name=project.name,
            description=project.description,
            created_at=project.created_at,
            id=project.id,
        )

    async def list_by_org(self, org_id: UUID) -> list[Project]:
        result = await self.session.execute(
            select(ProjectModel).where(ProjectModel.org_id == org_id)
        )
        rows = result.scalars()
        return [
            Project(
                id=row.id,
                org_id=row.org_id,
                name=row.name,
                description=row.description,
                created_at=row.created_at,
            )
            for row in rows
        ]
