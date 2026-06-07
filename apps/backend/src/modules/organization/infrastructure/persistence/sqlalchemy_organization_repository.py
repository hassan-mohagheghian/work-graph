from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.organization.domain.identities.organization import Organization
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)
from src.modules.organization.infrastructure.persistence.models import OrganizationModel


class SQLAlchemyOrganizationRepository(OrganizationRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, organization: Organization) -> None:
        org_model = OrganizationModel(
            id=organization.id,
            name=organization.name,
            owner_id=organization.owner_id,
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
            id=org_model.id,
            name=org_model.name,
            created_at=org_model.created_at,
            owner_id=org_model.owner_id,
        )

    async def get_by_id(self, org_id: UUID) -> Organization:

        result = await self.session.execute(
            select(OrganizationModel).where(OrganizationModel.id == org_id)
        )
        org_model = result.scalar_one_or_none()

        if not org_model:
            return None

        return Organization(
            id=org_model.id,
            name=org_model.name,
            created_at=org_model.created_at,
            owner_id=org_model.owner_id,
        )

    async def list_by_owner(self, owner_id: UUID) -> list[Organization]:
        result = await self.session.execute(
            select(OrganizationModel).where(OrganizationModel.owner_id == owner_id)
        )

        org_list = result.scalars()
        return [
            Organization(
                id=org.id,
                name=org.name,
                created_at=org.created_at,
                owner_id=org.owner_id,
            )
            for org in org_list
        ]
