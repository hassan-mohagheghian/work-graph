from abc import ABC, abstractmethod
from uuid import UUID


class FileStoragePort(ABC):
    @abstractmethod
    async def save(
        self,
        org_id: UUID,
        document_id: UUID,
        filename: str,
        content: bytes,
    ) -> str:
        """Persist file bytes and return a storage key."""

    @abstractmethod
    async def delete(self, storage_key: str) -> None:
        pass

    @abstractmethod
    def resolve_path(self, storage_key: str) -> str:
        """Return the absolute filesystem path for a storage key."""
