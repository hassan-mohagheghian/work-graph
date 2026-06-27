from fastapi import HTTPException
from src.modules.knowledge.application.commands.delete_document.command import (
    DeleteDocumentCommand,
)
from src.modules.knowledge.application.services.document_rbac import DocumentRBAC
from src.modules.knowledge.domain.ports.file_storage import FileStoragePort
from src.modules.knowledge.domain.repos.attachment_repo import AttachmentRepo
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo
from src.modules.organization.application.facade import OrgMembershipFacade


class DeleteDocumentHandler:
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

    async def handle(self, cmd: DeleteDocumentCommand) -> None:
        document = await self.document_repo.get_by_id(cmd.document_id)

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if document.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        role = await self.org_membership_facade.get_user_role(cmd.user_id, cmd.org_id)
        self.rbac.assert_can_delete(role)

        attachments = await self.attachment_repo.delete_by_document(cmd.document_id)
        for attachment in attachments:
            await self.file_storage.delete(attachment.storage_key)

        await self.document_repo.delete(cmd.document_id)
