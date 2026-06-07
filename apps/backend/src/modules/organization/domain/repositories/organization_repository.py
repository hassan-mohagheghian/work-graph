from abc import ABC, abstractmethod

from src.modules.organization.domain.identities.organization import Organization


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
