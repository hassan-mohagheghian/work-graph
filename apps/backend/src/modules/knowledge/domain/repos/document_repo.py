from abc import ABC, abstractmethod
from uuid import UUID

from src.modules.knowledge.domain.entities.document import Document
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType


class DocumentRepo(ABC):
    @abstractmethod
    async def create(self, document: Document) -> None:
        pass

    @abstractmethod
    async def get_by_id(self, document_id: UUID) -> Document | None:
        pass

    @abstractmethod
    async def update(self, document: Document) -> None:
        pass

    @abstractmethod
    async def delete(self, document_id: UUID) -> None:
        pass

    @abstractmethod
    async def list(
        self,
        org_id: UUID,
        target_type: LinkTargetType | None = None,
        target_id: UUID | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Document]:
        pass
