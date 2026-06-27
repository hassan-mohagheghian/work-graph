from dataclasses import dataclass
from uuid import UUID

from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.shared.domain.entity_v1 import CreatedAtMixin, Entity


@dataclass(eq=False)
class DocumentLink(Entity, CreatedAtMixin):
    org_id: UUID
    document_id: UUID
    target_type: LinkTargetType
    target_id: UUID
