from uuid import UUID

from fastapi import Depends, HTTPException, status
from src.modules.project.domain.repos.project_membership_repo import (
    ProjectMembershipRepo,
)
from src.modules.project.infrastructure.persistence.sqla_project_membership_repo import (
    SQLAProjectMembershipRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id


async def get_project_membership_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAProjectMembershipRepo(session=session)


async def get_project_access(
    project_id: UUID,
    user_id: str = Depends(get_current_user_id),
    repo: ProjectMembershipRepo = Depends(get_project_membership_repo),
):
    is_member = await repo.exists(project_id, user_id)

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a project member",
        )

    return project_id
