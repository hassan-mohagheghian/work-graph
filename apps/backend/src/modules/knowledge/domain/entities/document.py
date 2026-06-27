from dataclasses import dataclass, field
from uuid import UUID

from src.modules.knowledge.domain.entities.attachment import Attachment
from src.modules.knowledge.domain.entities.document_link import DocumentLink
from src.modules.shared.domain.entity_v1 import Entity, TimestampedMixin


@dataclass(eq=False)
class Document(Entity, TimestampedMixin):
    org_id: UUID
    title: str
    description: str | None = None
    created_by: UUID | None = None
    links: list[DocumentLink] = field(default_factory=list)
    attachments: list[Attachment] = field(default_factory=list)

    def update_content(self, title: str | None, description: str | None) -> None:
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        self.touch()
