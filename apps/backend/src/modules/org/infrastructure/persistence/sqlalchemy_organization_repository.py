from sqlalchemy import select

from src.modules.org.domain.identities.organization import Organization
from src.modules.org.domain.repositories.organization_repository import (
    OrganizationRepository,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.modules.org.infrastructure.persistence.models import OrganizationModel


class SQLAlchemyOrganizationRepository(OrganizationRepository):

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, organization: Organization) -> None:
        org_model = OrganizationModel(
            id=organization.id,
            name=organization.name,
            created_at=organization.created_at,
        )

        self.session.add(org_model)
        await self.session.commit()

    async def get_by_name(self, name: str) -> Organization | None:
        result = await self.session.execute(
            select(OrganizationModel).where(OrganizationModel.name == name)
        )
        org_model = result.scalar_one_or_none()
        if not org_model:
            return None

        return Organization(
            id=org_model.id, name=org_model.name, created_at=org_model.created_at
        )
