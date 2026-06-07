from fastapi import APIRouter, Depends, status
from src.modules.identity.api.auth_router import get_current_user_id
from src.modules.organization.application.handlers.create_org_handler import (
    CreateOrgHandler,
)
from src.modules.organization.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.organization.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)
from src.shared.config.database import AsyncSessionLocal

router = APIRouter(prefix="/org", tags=["Organizations"])


async def get_org_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrganizationRepository(session=session)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_org(
    name: str, repo=Depends(get_org_repo), user_id: str = Depends(get_current_user_id)
):
    handler = CreateOrgHandler(org_repo=repo)
    try:
        print("---------------------------------", user_id)
        org = await handler.handle(name=name, owner_id=user_id)
        return {
            "id": str(org.id),
            "name": org.name,
            "owner_id": org.owner_id,
            "created_at": org.created_at.isoformat(),
        }
    except OrganizationAlreadyExistsError as e:
        return {"detail": str(e)}
