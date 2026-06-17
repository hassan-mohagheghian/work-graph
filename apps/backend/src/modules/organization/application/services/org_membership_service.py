from uuid import UUID

from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole


class OrgMembershipService:
    def __init__(self, org_membership_repo: OrgMembershipRepo):
        self.org_membership_repo = org_membership_repo

    async def get_user_role(self, user_id: UUID, org_id: UUID) -> OrgRole:
        role = await self.org_membership_repo.get_role(user_id, org_id)

        return role
