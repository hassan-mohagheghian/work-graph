from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.organization.domain.entities.organization import Organization
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.models import (
    OrganizationModel,
    OrgMembershipModel,
)


@dataclass
class OrgSummary:
    id: UUID
    name: str
    role: OrgRole


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
            id=org_model.id,
            name=org_model.name,
            created_at=org_model.created_at,
        )

    async def get_by_id(self, org_id: UUID) -> Organization:

        result = await self.session.execute(
            select(OrganizationModel).where(OrganizationModel.id == org_id)
        )
        org_model = result.scalar_one_or_none()

        if not org_model:
            return None

        return Organization(
            id=org_model.id, name=org_model.name, created_at=org_model.created_at
        )

    async def list_by_user(self, user_id: UUID) -> list[OrgSummary]:
        stmt = (
            select(
                OrganizationModel.id, OrganizationModel.name, OrgMembershipModel.role
            )
            .join(OrgMembershipModel, OrganizationModel.id == OrgMembershipModel.org_id)
            .where(OrgMembershipModel.user_id == user_id)
            .distinct()
        )
        result = await self.session.execute(statement=stmt)
        rows = result.all()

        return [OrgSummary(id=r.id, name=r.name, role=r.role) for r in rows]
