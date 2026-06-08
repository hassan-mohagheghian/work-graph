from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.organization.domain.entities.membership import OrgMembership


class OrgMembershipRepo(ABC):
    @abstractmethod
    async def add(self, membership: OrgMembership) -> None:
        pass

    @abstractmethod
    async def get_by_user_and_org(
        self, user_id: UUID, org_id: UUID
    ) -> OrgMembership | None:
        pass

    @abstractmethod
    async def list_by_org(self, org_id: UUID) -> list[OrgMembership]:
        pass
