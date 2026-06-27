from dataclasses import dataclass
from uuid import UUID


@dataclass
class UpdateDocumentCommand:
    org_id: UUID
    user_id: UUID
    document_id: UUID
    title: str | None = None
    description: str | None = None
