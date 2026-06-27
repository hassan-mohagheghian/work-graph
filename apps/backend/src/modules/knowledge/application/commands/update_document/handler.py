from fastapi import HTTPException
from src.modules.knowledge.application.commands.update_document.command import (
    UpdateDocumentCommand,
)
from src.modules.knowledge.application.services.document_rbac import DocumentRBAC
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo
from src.modules.organization.application.facade import OrgMembershipFacade


class UpdateDocumentHandler:
    def __init__(
        self,
        document_repo: DocumentRepo,
        org_membership_facade: OrgMembershipFacade,
        rbac: DocumentRBAC,
    ):
        self.document_repo = document_repo
        self.org_membership_facade = org_membership_facade
        self.rbac = rbac

    async def handle(self, cmd: UpdateDocumentCommand):
        document = await self.document_repo.get_by_id(cmd.document_id)

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if document.org_id != cmd.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        role = await self.org_membership_facade.get_user_role(cmd.user_id, cmd.org_id)
        self.rbac.assert_can_update(role)

        document.update_content(cmd.title, cmd.description)
        await self.document_repo.update(document)
        return document
