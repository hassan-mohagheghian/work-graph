from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.organization.domain.entities.organization import Organization


class OrganizationRepository(ABC):
    @abstractmethod
    async def add(self, organization: Organization) -> None:
        """
        Raises:
            - OrganizationAlreadyExistsError
        """
        pass

    @abstractmethod
    async def get_by_name(self, name: str) -> Organization | None:
        pass

    @abstractmethod
    def get_by_id(self, org_id: UUID) -> Organization | None:
        pass

    @abstractmethod
    def list_by_owner(self, owner_id: UUID) -> list[Organization]:
        pass
