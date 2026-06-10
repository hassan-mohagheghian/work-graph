from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.value_objects.role import OrgRole


class OrgMembershipRepo(ABC):
    @abstractmethod
    async def add(self, membership: OrgMembership) -> None:
        pass

    @abstractmethod
    async def delete(self, org_id: UUID, user_id: UUID) -> None:
        pass

    @abstractmethod
    async def get_by_user_and_org(
        self, user_id: UUID, org_id: UUID
    ) -> OrgMembership | None:
        pass

    @abstractmethod
    async def list_by_org(self, org_id: UUID) -> list[OrgMembership]:
        pass

    @abstractmethod
    async def get_by_owner(self, org_id: UUID) -> OrgMembership | None:
        pass

    @abstractmethod
    async def get_by_role(self, org_id: UUID, role: OrgRole) -> OrgMembership | None:
        pass

    @abstractmethod
    async def update_role(self, org_id: UUID, user_id: UUID, role: OrgRole) -> None:
        pass
