from uuid import UUID

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.identity.infrastructure.persistence.models import UserModel
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMember,
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

    async def delete(self, org_id: UUID, user_id: UUID):
        stmt = delete(OrgMembershipModel).where(
            OrgMembershipModel.org_id == org_id, OrgMembershipModel.user_id == user_id
        )
        await self.session.execute(stmt)
        await self.session.commit()

    async def exits(self, org_id, user_id):
        result = await self.session.execute(
            select(OrgMembershipModel).where(
                OrgMembershipModel.user_id == user_id,
                OrgMembershipModel.org_id == org_id,
            )
        )
        membership = result.scalar_one_or_none()

        if not membership:
            return False
        return True

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

    async def get_role(self, user_id, org_id) -> OrgRole | None:
        result = await self.session.execute(
            select(OrgMembershipModel).where(
                OrgMembershipModel.user_id == user_id,
                OrgMembershipModel.org_id == org_id,
            )
        )
        membership = result.scalar_one_or_none()

        if not membership:
            return None
        return OrgRole(membership.role)

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

    async def list_members_by_org(self, org_id: UUID) -> list[OrgMember]:
        result = await self.session.execute(
            select(
                UserModel.id,
                UserModel.display_name,
                UserModel.email,
                OrgMembershipModel.role,
            )
            .join(OrgMembershipModel, UserModel.id == OrgMembershipModel.user_id)
            .where(OrgMembershipModel.org_id == org_id)
        )
        rows = result.all()

        return [
            OrgMember(
                user_id=row.id, name=row.display_name, email=row.email, role=row.role
            )
            for row in rows
        ]

    async def get_by_owner(self, org_id: UUID) -> OrgMembership | None:
        result = await self.session.execute(
            select(OrgMembershipModel).where(
                OrgMembershipModel.org_id == org_id,
                OrgMembershipModel.role == OrgRole.OWNER,
            )
        )

        membership = result.scalar_one_or_none()

        if not membership:
            return None

        return OrgMembership(
            id=membership.id,
            org_id=membership.org_id,
            user_id=membership.user_id,
            role=membership.role,
            created_at=membership.created_at,
        )

    async def get_by_role(self, org_id: UUID, role: OrgRole) -> OrgMembership | None:
        result = await self.session.execute(
            select(OrgMembershipModel).where(
                OrgMembershipModel.org_id == org_id,
                OrgMembershipModel.role == role,
            )
        )

        membership = result.scalar_one_or_none()

        if not membership:
            return None

        return OrgMembership(
            id=membership.id,
            org_id=membership.org_id,
            user_id=membership.user_id,
            role=membership.role,
            created_at=membership.created_at,
        )

    async def update_role(self, org_id: str, user_id: str, role):
        stmt = (
            update(OrgMembershipModel)
            .where(
                OrgMembershipModel.org_id == org_id,
                OrgMembershipModel.user_id == user_id,
            )
            .values(role=role)
        )
        await self.session.execute(stmt)
        await self.session.commit()

    async def count_owners(self, org_id: UUID) -> int:
        stmt = select(func.count()).where(
            OrgMembershipModel.org_id == org_id,
            OrgMembershipModel.role == OrgRole.OWNER,
        )

        result = await self.session.execute(stmt)
        return result.scalar_one()
