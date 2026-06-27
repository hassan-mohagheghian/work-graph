from datetime import datetime, timezone

from fastapi import HTTPException
from src.modules.knowledge.application.commands.upload_attachment.command import (
    UploadAttachmentCommand,
)
from src.modules.knowledge.application.services.document_rbac import DocumentRBAC
from src.modules.knowledge.domain.entities.attachment import Attachment
from src.modules.knowledge.domain.ports.file_storage import FileStoragePort
from src.modules.knowledge.domain.repos.attachment_repo import AttachmentRepo
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo
from src.modules.organization.application.facade import OrgMembershipFacade


class UploadAttachmentHandler:
    def __init__(
        self,
        document_repo: DocumentRepo,
        attachment_repo: AttachmentRepo,
        file_storage: FileStoragePort,
        org_membership_facade: OrgMembershipFacade,
        rbac: DocumentRBAC,
    ):
        self.document_repo = document_repo
        self.attachment_repo = attachment_repo
        self.file_storage = file_storage
        self.org_membership_facade = org_membership_facade
        self.rbac = rbac

    async def handle(self, cmd: UploadAttachmentCommand) -> Attachment:
        document = await self.document_repo.get_by_id(cmd.document_id)

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if document.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        role = await self.org_membership_facade.get_user_role(cmd.user_id, cmd.org_id)
        self.rbac.assert_can_update(role)

        storage_key = await self.file_storage.save(
            org_id=cmd.org_id,
            document_id=cmd.document_id,
            filename=cmd.filename,
            content=cmd.content,
        )

        attachment = Attachment(
            org_id=cmd.org_id,
            document_id=cmd.document_id,
            filename=cmd.filename,
            content_type=cmd.content_type,
            size_bytes=len(cmd.content),
            storage_key=storage_key,
            created_at=datetime.now(timezone.utc),
        )

        await self.attachment_repo.create(attachment)
        return attachment
