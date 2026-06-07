from src.modules.organization.domain.exceptions import OrganizationAlreadyExistsError
from src.modules.organization.domain.identities.organization import Organization
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class CreateOrgHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, name: str, owner_id: str) -> Organization:
        existing = await self.org_repo.get_by_name(name)
        if existing:
            raise OrganizationAlreadyExistsError(f"Organization {name} already exits.")
        org = Organization(name=name, owner_id=owner_id)
        await self.org_repo.add(organization=org)
        return org
