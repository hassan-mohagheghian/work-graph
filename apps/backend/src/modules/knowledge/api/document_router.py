from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from src.modules.knowledge.api.serializers import serialize_attachment, serialize_document
from src.modules.knowledge.application.commands.create_document.command import (
    CreateDocumentCommand,
    DocumentLinkInput,
)
from src.modules.knowledge.application.commands.create_document.handler import (
    CreateDocumentHandler,
)
from src.modules.knowledge.application.commands.delete_attachment.command import (
    DeleteAttachmentCommand,
)
from src.modules.knowledge.application.commands.delete_attachment.handler import (
    DeleteAttachmentHandler,
)
from src.modules.knowledge.application.commands.delete_document.command import (
    DeleteDocumentCommand,
)
from src.modules.knowledge.application.commands.delete_document.handler import (
    DeleteDocumentHandler,
)
from src.modules.knowledge.application.commands.update_document.command import (
    UpdateDocumentCommand,
)
from src.modules.knowledge.application.commands.update_document.handler import (
    UpdateDocumentHandler,
)
from src.modules.knowledge.application.commands.upload_attachment.command import (
    UploadAttachmentCommand,
)
from src.modules.knowledge.application.commands.upload_attachment.handler import (
    UploadAttachmentHandler,
)
from src.modules.knowledge.application.queries.get_document.handler import (
    GetDocumentHandler,
)
from src.modules.knowledge.application.queries.get_document.query import GetDocumentQuery
from src.modules.knowledge.application.queries.list_documents.handler import (
    ListDocumentsHandler,
)
from src.modules.knowledge.application.queries.list_documents.query import (
    ListDocumentsQuery,
)
from src.modules.knowledge.application.services.document_rbac import DocumentRBAC
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.knowledge.infrastructure.persistence.sqlalchemy_attachment_repo import (
    SqlAlchemyAttachmentRepo,
)
from src.modules.knowledge.infrastructure.persistence.sqlalchemy_document_repo import (
    SqlAlchemyDocumentRepo,
)
from src.modules.knowledge.infrastructure.storage.local_file_storage import (
    LocalFileStorage,
)
from src.modules.project.api.project_router import get_project_repo
from src.modules.task.api.task_router import get_task_repo
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id
from src.shared.infrastructure.dependencies.org import get_org_membership_facade
from src.shared.infrastructure.dependencies.org_context import get_current_org_id

router = APIRouter(prefix="/documents", tags=["documents"])


async def get_document_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyDocumentRepo(session=session)


async def get_attachment_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyAttachmentRepo(session=session)


def get_file_storage():
    return LocalFileStorage()


class DocumentLinkRequest(BaseModel):
    target_type: LinkTargetType
    target_id: UUID


class CreateDocumentRequest(BaseModel):
    title: str
    description: str | None = None
    links: list[DocumentLinkRequest]


class UpdateDocumentRequest(BaseModel):
    title: str | None = None
    description: str | None = None


@router.post("")
async def create_document(
    body: CreateDocumentRequest,
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    project_repo=Depends(get_project_repo),
    task_repo=Depends(get_task_repo),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = CreateDocumentHandler(
        document_repo=document_repo,
        project_repo=project_repo,
        task_repo=task_repo,
        org_membership_facade=org_membership_facade,
        rbac=DocumentRBAC(),
    )
    document = await handler.handle(
        CreateDocumentCommand(
            org_id=org_id,
            user_id=user_id,
            title=body.title,
            description=body.description,
            links=[
                DocumentLinkInput(
                    target_type=link.target_type,
                    target_id=link.target_id,
                )
                for link in body.links
            ],
        )
    )
    return serialize_document(document)


@router.get("")
async def list_documents(
    target_type: LinkTargetType | None = None,
    target_id: UUID | None = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
):
    handler = ListDocumentsHandler(document_repo)
    documents = await handler.handle(
        ListDocumentsQuery(
            org_id=org_id,
            target_type=target_type,
            target_id=target_id,
            limit=limit,
            offset=offset,
        )
    )
    return [serialize_document(doc) for doc in documents]


@router.get("/{document_id}")
async def get_document(
    document_id: UUID,
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
):
    handler = GetDocumentHandler(document_repo)
    document = await handler.handle(GetDocumentQuery(document_id=document_id, org_id=org_id))
    return serialize_document(document)


@router.patch("/{document_id}")
async def update_document(
    document_id: UUID,
    body: UpdateDocumentRequest,
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = UpdateDocumentHandler(
        document_repo=document_repo,
        org_membership_facade=org_membership_facade,
        rbac=DocumentRBAC(),
    )
    document = await handler.handle(
        UpdateDocumentCommand(
            org_id=org_id,
            user_id=user_id,
            document_id=document_id,
            title=body.title,
            description=body.description,
        )
    )
    return serialize_document(document)


@router.delete("/{document_id}")
async def delete_document(
    document_id: UUID,
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    attachment_repo=Depends(get_attachment_repo),
    file_storage=Depends(get_file_storage),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = DeleteDocumentHandler(
        document_repo=document_repo,
        attachment_repo=attachment_repo,
        file_storage=file_storage,
        org_membership_facade=org_membership_facade,
        rbac=DocumentRBAC(),
    )
    await handler.handle(
        DeleteDocumentCommand(
            org_id=org_id,
            user_id=user_id,
            document_id=document_id,
        )
    )
    return {"status": "deleted"}


@router.post("/{document_id}/attachments")
async def upload_attachment(
    document_id: UUID,
    file: UploadFile = File(...),
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    attachment_repo=Depends(get_attachment_repo),
    file_storage=Depends(get_file_storage),
    org_membership_facade=Depends(get_org_membership_facade),
):
    content = await file.read()
    handler = UploadAttachmentHandler(
        document_repo=document_repo,
        attachment_repo=attachment_repo,
        file_storage=file_storage,
        org_membership_facade=org_membership_facade,
        rbac=DocumentRBAC(),
    )
    attachment = await handler.handle(
        UploadAttachmentCommand(
            org_id=org_id,
            user_id=user_id,
            document_id=document_id,
            filename=file.filename or "upload",
            content_type=file.content_type or "application/octet-stream",
            content=content,
        )
    )
    return serialize_attachment(attachment)


@router.delete("/{document_id}/attachments/{attachment_id}")
async def delete_attachment(
    document_id: UUID,
    attachment_id: UUID,
    user_id=Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    attachment_repo=Depends(get_attachment_repo),
    file_storage=Depends(get_file_storage),
    org_membership_facade=Depends(get_org_membership_facade),
):
    handler = DeleteAttachmentHandler(
        document_repo=document_repo,
        attachment_repo=attachment_repo,
        file_storage=file_storage,
        org_membership_facade=org_membership_facade,
        rbac=DocumentRBAC(),
    )
    await handler.handle(
        DeleteAttachmentCommand(
            org_id=org_id,
            user_id=user_id,
            document_id=document_id,
            attachment_id=attachment_id,
        )
    )
    return {"status": "deleted"}


@router.get("/{document_id}/attachments/{attachment_id}/download")
async def download_attachment(
    document_id: UUID,
    attachment_id: UUID,
    org_id=Depends(get_current_org_id),
    document_repo=Depends(get_document_repo),
    attachment_repo=Depends(get_attachment_repo),
    file_storage=Depends(get_file_storage),
):
    handler = GetDocumentHandler(document_repo)
    await handler.handle(GetDocumentQuery(document_id=document_id, org_id=org_id))

    attachment = await attachment_repo.get_by_id(attachment_id)
    if not attachment or attachment.document_id != document_id:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Attachment not found")

    return FileResponse(
        path=file_storage.resolve_path(attachment.storage_key),
        filename=attachment.filename,
        media_type=attachment.content_type,
    )
