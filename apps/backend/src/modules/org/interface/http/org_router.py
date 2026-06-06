from fastapi import APIRouter, Depends, status

from src.config.database import AsyncSessionLocal
from src.modules.org.application.handlers.create_org_handler import CreateOrgHandler
from src.modules.org.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.org.infrastructure.persistence.sqlalchemy_organization_repository import (
    SQLAlchemyOrganizationRepository,
)

router = APIRouter(prefix="/org", tags=["Organizations"])


async def get_org_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrganizationRepository(session=session)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_org(name: str, repo=Depends(get_org_repo)):
    handler = CreateOrgHandler(org_repo=repo)
    try:
        org = await handler.handle(name=name)
        return {
            "id": str(org.id),
            "name": org.name,
            "created_at": org.created_at.isoformat(),
        }
    except OrganizationAlreadyExistsError as e:
        return {"detail": str(e)}
