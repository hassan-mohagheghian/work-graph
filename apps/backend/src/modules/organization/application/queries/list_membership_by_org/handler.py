from src.modules.organization.application.queries.list_membership_by_org.query import (
    OrgMembersQuery,
)
from src.modules.organization.application.queries.list_membership_by_org.response import (
    OrgMemberItem,
    OrgMembersResponse,
)
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)


class ListOrgMembersHandler:
    def __init__(self, membership_repo: OrgMembershipRepo):
        self.membership_repo = membership_repo

    async def handle(self, query: OrgMembersQuery) -> OrgMembersResponse:
        memberships = await self.membership_repo.list_by_org(org_id=query.org_id)

        return OrgMembersResponse(
            members=[
                OrgMemberItem(user_id=item.user_id, role=item.role)
                for item in memberships
            ]
        )
