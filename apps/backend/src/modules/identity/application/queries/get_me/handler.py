from src.modules.identity.application.queries.get_me.query import GetMeQuery
from src.modules.identity.application.queries.get_me.response import (
    GetMeResponse,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class GetMeQueryHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, query: GetMeQuery) -> GetMeResponse:
        return GetMeResponse(id=query.user_id)
