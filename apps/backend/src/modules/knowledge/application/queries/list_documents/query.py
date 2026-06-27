from dataclasses import dataclass
from uuid import UUID

from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType


@dataclass
class ListDocumentsQuery:
    org_id: UUID
    target_type: LinkTargetType | None = None
    target_id: UUID | None = None
    limit: int = 20
    offset: int = 0
