from src.modules.organization.application.queries.list_by_owner.list_by_owner_query import (
    ListOrgsByOwnerQuery,
)
from src.modules.organization.application.queries.list_by_owner.list_by_owner_response import (
    ListOrgByOwnerResponse,
    OrgItem,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class ListOrgsByOwnerHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, query: ListOrgsByOwnerQuery) -> ListOrgByOwnerResponse:
        org_list = await self.org_repo.list_by_owner(owner_id=query.owner_id)
        return [
            OrgItem(id=org.id, name=org.name, created_at=org.created_at.isoformat())
            for org in org_list
        ]
