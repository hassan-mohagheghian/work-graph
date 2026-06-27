from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.knowledge.domain.entities.attachment import Attachment


class AttachmentRepo(ABC):
    @abstractmethod
    async def create(self, attachment: Attachment) -> None:
        pass

    @abstractmethod
    async def get_by_id(self, attachment_id: UUID) -> Attachment | None:
        pass

    @abstractmethod
    async def list_by_document(self, document_id: UUID) -> list[Attachment]:
        pass

    @abstractmethod
    async def delete(self, attachment_id: UUID) -> None:
        pass

    @abstractmethod
    async def delete_by_document(self, document_id: UUID) -> list[Attachment]:
        pass
