from uuid import UUID

from sqlalchemy import delete, select, update
from src.modules.project.domain.entities.project_membership import ProjectMembership
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)
from src.modules.project.infrastructure.persistence.models import ProjectMembershipModel


class SQLAProjectMembershipRepo(ProjectMembershipRepo):
    def __init__(self, session):
        self.session = session

    async def add(self, membership: ProjectMembership) -> None:

        obj = ProjectMembershipModel(
            project_id=membership.project_id,
            org_id=membership.org_id,
            user_id=membership.user_id,
            role=membership.role,
        )
        self.session.add(obj)
        await self.session.commit()

    async def exists(self, project_id: UUID, user_id: UUID) -> bool:
        stmt = select(ProjectMembershipModel).where(
            ProjectMembershipModel.project_id == project_id,
            ProjectMembershipModel.user_id == user_id,
        )

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def get_role(self, project_id: UUID, user_id: UUID) -> str:
        stmt = select(ProjectMembershipModel.role).where(
            ProjectMembershipModel.project_id == project_id,
            ProjectMembershipModel.user_id == user_id,
        )

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_project(
        self,
        project_id: UUID,
    ) -> list[ProjectMembership]:
        stmt = select(ProjectMembershipModel).where(
            ProjectMembershipModel.project_id == project_id
        )

        result = await self.session.execute(stmt)

        return [
            ProjectMembership(
                org_id=row.org_id,
                project_id=row.project_id,
                user_id=row.user_id,
                role=row.role,
                created_at=row.created_at,
            )
            for row in result.scalars().all()
        ]

    async def update_role(self, project_id, user_id, role):
        stmt = (
            update(ProjectMembershipModel)
            .where(
                ProjectMembershipModel.project_id == project_id,
                ProjectMembershipModel.user_id == user_id,
            )
            .values(role=role)
        )
        await self.session.execute(stmt)
        await self.session.commit()

    async def remove(self, project_id, user_id):
        stmt = delete(ProjectMembershipModel).where(
            ProjectMembershipModel.project_id == project_id,
            ProjectMembershipModel.user_id == user_id,
        )
        await self.session.execute(stmt)
        await self.session.commit()
