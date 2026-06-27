from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteDocumentCommand:
    org_id: UUID
    user_id: UUID
    document_id: UUID
