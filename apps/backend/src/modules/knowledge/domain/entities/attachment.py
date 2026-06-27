from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import CreatedAtMixin, Entity


@dataclass(eq=False)
class Attachment(Entity, CreatedAtMixin):
    org_id: UUID
    document_id: UUID
    filename: str
    content_type: str
    size_bytes: int
    storage_key: str
