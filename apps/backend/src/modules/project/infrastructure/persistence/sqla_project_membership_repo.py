from uuid import UUID

from sqlalchemy import delete, select, update
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)
from src.modules.project.infrastructure.persistence.models import ProjectMembershipModel


class SQLAProjectMembershipRepo(ProjectMembershipRepo):
    def __init__(self, session):
        self.session = session

    async def add(self, project_id, org_id, user_id, role):
        obj = ProjectMembershipModel(
            project_id=project_id,
            org_id=org_id,
            user_id=user_id,
            role=role,
        )
        self.session.add(obj)
        await self.session.commit()
        return obj

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
