from src.modules.organization.application.queries.get_org.get_org_query import (
    GetOrgQuery,
)
from src.modules.organization.application.queries.get_org.get_org_response import (
    GetOrgResponse,
)
from src.modules.organization.domain.entities import Organization
from src.modules.organization.domain.exceptions import OrganizationNotFoundError
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class GetOrgHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, query: GetOrgQuery) -> Organization:
        org = await self.org_repo.get_by_id(query.org_id)
        if not org:
            raise OrganizationNotFoundError(
                f"Organization with id {query.org_id} not found"
            )
        return GetOrgResponse(id=str(org.id), name=org.name, owner_id=org.owner_id)
