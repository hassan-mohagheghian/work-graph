from uuid import UUID

from fastapi import APIRouter, Depends, status
from src.modules.organization.application.commands.create_org.command import (
    CreateOrgCommand,
)
from src.modules.organization.application.commands.create_org.handler import (
    CreateOrgHandler,
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
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.exceptions import OrganizationAlreadyExistsError
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

router = APIRouter(prefix="/org", tags=["Organizations"])


async def get_org_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrganizationRepository(session=session)


async def get_org_membership_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrgMembershipRepo(session=session)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_org(
    name: str,
    org_repo=Depends(get_org_repo),
    org_membership_repo=Depends(get_org_membership_repo),
    user_id: str = Depends(get_current_user_id),
):
    handler = CreateOrgHandler(
        org_repo=org_repo, org_membership_repo=org_membership_repo
    )
    try:
        org = await handler.handle(CreateOrgCommand(name=name, owner_id=user_id))
        return {
            "id": str(org.id),
            "name": org.name,
            "created_at": org.created_at.isoformat(),
        }
    except OrganizationAlreadyExistsError as e:
        return {"detail": str(e)}


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
