from src.modules.organization.application.queries.list_by_owner.list_by_owner_query import (
    ListOrgsByUserQuery,
)
from src.modules.organization.application.queries.list_by_owner.list_by_owner_response import (
    ListOrgByUserResponse,
    OrgItem,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class ListOrgsByUserHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, query: ListOrgsByUserQuery) -> ListOrgByUserResponse:
        org_list = await self.org_repo.list_by_user(user_id=query.user_id)
        return [OrgItem(id=org.id, name=org.name, role=org.role) for org in org_list]
