from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from src.modules.identity.api.auth_router import get_user_repo
from src.modules.identity.domain.repositories.user_repository import UserRepository
from src.modules.organization.application.commands.add_org_member.command import (
    AddOrgMemberCommand,
)
from src.modules.organization.application.commands.add_org_member.handler import (
    AddOrgMemberHandler,
)
from src.modules.organization.application.commands.change_role.command import (
    ChangeOrgMemberRoleCommand,
)
from src.modules.organization.application.commands.change_role.handler import (
    ChangeOrgMemberRoleHandler,
)
from src.modules.organization.application.commands.create_org.command import (
    CreateOrgCommand,
)
from src.modules.organization.application.commands.create_org.handler import (
    CreateOrgHandler,
)
from src.modules.organization.application.commands.delete_org_member.command import (
    DeleteOrgMemberCommand,
)
from src.modules.organization.application.commands.delete_org_member.handler import (
    DeleteOrgMemberHandler,
)
from src.modules.organization.application.queries.get_org.get_org_handler import (
    GetOrgHandler,
)
from src.modules.organization.application.queries.get_org.get_org_query import (
    GetOrgQuery,
)
from src.modules.organization.application.queries.list_by_owner.list_by_owner_handler import (
    ListOrgsByUserHandler,
)
from src.modules.organization.application.queries.list_by_owner.list_by_owner_query import (
    ListOrgsByUserQuery,
)
from src.modules.organization.application.queries.list_membership_by_org.handler import (
    ListOrgMembersHandler,
)
from src.modules.organization.application.queries.list_membership_by_org.query import (
    OrgMembersQuery,
)
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)
from src.modules.organization.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import (
    get_current_user_id,
    require_org_role,
)

router = APIRouter(prefix="/organizations", tags=["Organizations"])


async def get_org_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrganizationRepository(session=session)


async def get_org_membership_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrgMembershipRepo(session=session)


class CreateOrganizationRequest(BaseModel):
    name: str


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_org(
    body: CreateOrganizationRequest,
    org_repo=Depends(get_org_repo),
    org_membership_repo=Depends(get_org_membership_repo),
    user_id: str = Depends(get_current_user_id),
):
    handler = CreateOrgHandler(
        org_repo=org_repo, org_membership_repo=org_membership_repo
    )
    try:
        org = await handler.handle(CreateOrgCommand(name=body.name, owner_id=user_id))
        return {
            "id": str(org.id),
            "name": org.name,
            "created_at": org.created_at.isoformat(),
        }
    except OrganizationAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/{org_id}")
async def get_org(org_id: UUID, repo=Depends(get_org_repo)):
    handler = GetOrgHandler(org_repo=repo)
    query = GetOrgQuery(org_id=org_id)
    return await handler.handle(query=query)


@router.get("")
async def list_orgs_by_user(
    user_id: str = Depends(get_current_user_id), repo=Depends(get_org_repo)
):
    handler = ListOrgsByUserHandler(org_repo=repo)
    query = ListOrgsByUserQuery(user_id=user_id)
    return await handler.handle(query=query)


@router.get("/{org_id}/secure-data")
async def secure_org_data(
    org_id: str,
    membership: OrgMembership = Depends(require_org_role(OrgRole.OWNER)),
):
    return {"msg": f"User {membership.user_id} is OWNER and can access this"}


class AddMemberRequest(BaseModel):
    user_id: str
    role: str


@router.post("/{org_id}/members")
async def add_member(
    org_id: str,
    body: AddMemberRequest,
    current_membership=Depends(require_org_role(OrgRole.OWNER)),
    membership_repo: OrgMembershipRepo = Depends(get_org_membership_repo),
    user_repo: UserRepository = Depends(get_user_repo),
):
    handler = AddOrgMemberHandler(
        org_membership_repo=membership_repo,
        user_repo=user_repo,
    )

    cmd = AddOrgMemberCommand(
        org_id=org_id,
        user_id=body.user_id,
        role=body.role,
    )

    return await handler.handle(cmd=cmd, current_user_membership=current_membership)


@router.get("/{org_id}/members")
async def list_members(
    org_id: str,
    membership_repo: OrgMembershipRepo = Depends(get_org_membership_repo),
):
    handler = ListOrgMembersHandler(membership_repo=membership_repo)
    query = OrgMembersQuery(org_id=org_id)

    return await handler.handle(query=query)


@router.delete("/{org_id}/members/{user_id}")
async def delete_member(
    org_id: str,
    user_id: str,
    actor_membership=Depends(require_org_role(OrgRole.OWNER)),
    repo: OrgMembershipRepo = Depends(get_org_membership_repo),
):
    handler = DeleteOrgMemberHandler(repo)
    cmd = DeleteOrgMemberCommand(org_id=org_id, target_user_id=user_id)

    return await handler.handle(cmd=cmd, actor_membership=actor_membership)


class ChangeRoleRequest(BaseModel):
    role: OrgRole


@router.patch("/{org_id}/members/{user_id}")
async def change_role(
    org_id: str,
    user_id: str,
    body: ChangeRoleRequest,
    actor_membership=Depends(require_org_role(OrgRole.OWNER)),
    repo: SQLAlchemyOrgMembershipRepo = Depends(get_org_membership_repo),
):
    handler = ChangeOrgMemberRoleHandler(repo)
    cmd = ChangeOrgMemberRoleCommand(
        org_id=org_id, target_user_id=user_id, new_role=body.role
    )

    return await handler.handle(cmd=cmd, actor_membership=actor_membership)
