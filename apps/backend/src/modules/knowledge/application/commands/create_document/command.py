from dataclasses import dataclass
from uuid import UUID

from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType


@dataclass
class DocumentLinkInput:
    target_type: LinkTargetType
    target_id: UUID


@dataclass
class CreateDocumentCommand:
    org_id: UUID
    user_id: UUID
    title: str
    description: str | None
    links: list[DocumentLinkInput]
