from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.models import (
    OrgMembershipModel,
)


class SQLAlchemyOrgMembershipRepo(OrgMembershipRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add(self, membership: OrgMembership) -> None:
        model = OrgMembershipModel(
            id=membership.id,
            org_id=membership.org_id,
            user_id=membership.user_id,
            role=membership.role.value,
            created_at=membership.created_at,
        )

        self.session.add(model)
        await self.session.commit()

    async def get_by_user_and_org(self, user_id: UUID, org_id: UUID) -> OrgMembership:
        result = await self.session.execute(
            select(OrgMembershipModel).where(
                OrgMembershipModel.user_id == user_id,
                OrgMembershipModel.org_id == org_id,
            )
        )

        org_membership_model = result.scalar_one_or_none()

        if not org_membership_model:
            return None

        return OrgMembership(
            org_id=org_membership_model.org_id,
            user_id=org_membership_model.user_id,
            role=OrgRole(org_membership_model.role),
            created_at=org_membership_model.created_at,
        )

    async def list_by_org(self, org_id: UUID) -> list[OrgMembership]:
        result = await self.session.execute(
            select(OrgMembershipModel).where(OrgMembershipModel.org_id == org_id)
        )

        membership_list = result.scalars()

        return [
            OrgMembership(
                org_id=membership.org_id,
                user_id=membership.user_id,
                role=OrgRole(membership.role),
                created_at=membership.created_at,
            )
            for membership in membership_list
        ]
