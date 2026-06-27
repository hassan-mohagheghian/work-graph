from src.modules.knowledge.domain.entities.attachment import Attachment
from src.modules.knowledge.domain.entities.document import Document
from src.modules.knowledge.domain.entities.document_link import DocumentLink


def serialize_link(link: DocumentLink) -> dict:
    return {
        "id": str(link.id),
        "target_type": link.target_type.value,
        "target_id": str(link.target_id),
        "created_at": link.created_at.isoformat(),
    }


def serialize_attachment(attachment: Attachment) -> dict:
    return {
        "id": str(attachment.id),
        "filename": attachment.filename,
        "content_type": attachment.content_type,
        "size_bytes": attachment.size_bytes,
        "created_at": attachment.created_at.isoformat(),
    }


def serialize_document(document: Document) -> dict:
    return {
        "id": str(document.id),
        "org_id": str(document.org_id),
        "title": document.title,
        "description": document.description,
        "created_by": str(document.created_by) if document.created_by else None,
        "created_at": document.created_at.isoformat(),
        "updated_at": document.updated_at.isoformat(),
        "links": [serialize_link(link) for link in document.links],
        "attachments": [serialize_attachment(att) for att in document.attachments],
    }
