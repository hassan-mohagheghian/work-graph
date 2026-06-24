from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from src.modules.identity.domain.repositories.user_repository import UserRepository
from src.modules.project.application.commands.add_project_member.command import (
    AddProjectMemberCommand,
)
from src.modules.project.domain.entities.project_membership import ProjectMembership
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)


class AddProjectMemberHandler:
    def __init__(self, repo: ProjectMembershipRepo, user_repo: UserRepository):
        self.repo = repo
        self.user_repo = user_repo

    async def handle(self, cmd: AddProjectMemberCommand):
        user = await self.user_repo.get_by_email(email=cmd.email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        membership = ProjectMembership(
            project_id=cmd.project_id,
            org_id=cmd.org_id,
            user_id=user.id,
            role=cmd.role,
            created_at=datetime.now(timezone.utc),
        )

        try:
            membership = await self.repo.add(membership=membership)
        except IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)

        return membership
