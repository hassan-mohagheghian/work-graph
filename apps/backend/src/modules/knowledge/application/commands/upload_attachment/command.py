from dataclasses import dataclass
from uuid import UUID


@dataclass
class UploadAttachmentCommand:
    org_id: UUID
    user_id: UUID
    document_id: UUID
    filename: str
    content_type: str
    content: bytes
