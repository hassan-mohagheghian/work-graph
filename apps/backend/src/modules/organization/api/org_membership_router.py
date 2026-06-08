from uuid import UUID

from fastapi import APIRouter, Depends, status
from src.modules.organization.application.commands.create_membership.command import (
    CreateMembershipCommand,
)
from src.modules.organization.application.commands.create_membership.handler import (
    CreateOrgMembershipHandler,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)
from src.shared.config.database import AsyncSessionLocal

router = APIRouter(prefix="/org/membership", tags=["organization-membership"])


async def get_org_membership_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrgMembershipRepo(session=session)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_org_membership(
    org_id: UUID, user_id: UUID, role: OrgRole, repo=Depends(get_org_membership_repo)
):
    cmd = CreateMembershipCommand(org_id=org_id, user_id=user_id, role=role.value)
    handler = CreateOrgMembershipHandler(repo=repo)

    return await handler.handle(cmd=cmd)
