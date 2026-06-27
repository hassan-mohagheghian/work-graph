from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteAttachmentCommand:
    org_id: UUID
    user_id: UUID
    document_id: UUID
    attachment_id: UUID
