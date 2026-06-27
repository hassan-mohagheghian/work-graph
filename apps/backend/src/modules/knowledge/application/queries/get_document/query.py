from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetDocumentQuery:
    document_id: UUID
    org_id: UUID
