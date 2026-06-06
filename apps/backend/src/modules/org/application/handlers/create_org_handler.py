from src.modules.org.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.org.domain.identities.organization import Organization
from src.modules.org.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class CreateOrgHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, name: str) -> Organization:
        existing = await self.org_repo.get_by_name(name)
        if existing:
            raise OrganizationAlreadyExistsError(f"Organization {name} already exits.")
        org = Organization(name=name)
        await self.org_repo.add(organization=org)
        return org
