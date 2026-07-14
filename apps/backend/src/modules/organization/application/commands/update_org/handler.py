from src.modules.organization.application.commands.update_org.command import (
    UpdateOrgCommand,
)
from src.modules.organization.domain.exceptions import (
    OrganizationAlreadyExistsError,
    OrganizationNotFoundError,
)
from src.modules.organization.domain.repositories.organization_repository import (
    OrganizationRepository,
)


class UpdateOrgHandler:
    def __init__(self, org_repo: OrganizationRepository):
        self.org_repo = org_repo

    async def handle(self, cmd: UpdateOrgCommand):
        org = await self.org_repo.get_by_id(cmd.org_id)

        if not org:
            raise OrganizationNotFoundError("Organization not found")

        if cmd.name is not None:
            existing = await self.org_repo.get_by_name(cmd.name)
            if existing and existing.id != org.id:
                raise OrganizationAlreadyExistsError(
                    f"Organization {cmd.name} already exists."
                )
            org.name = cmd.name

        await self.org_repo.update(org)
        return org
