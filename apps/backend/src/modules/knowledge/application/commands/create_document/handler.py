from datetime import datetime, timezone

from fastapi import HTTPException
from src.modules.knowledge.application.commands.create_document.command import (
    CreateDocumentCommand,
)
from src.modules.knowledge.application.services.document_rbac import DocumentRBAC
from src.modules.knowledge.domain.entities.document import Document
from src.modules.knowledge.domain.entities.document_link import DocumentLink
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.organization.application.facade import OrgMembershipFacade
from src.modules.project.domain.repos.project_repo import ProjectRepository
from src.modules.task.domain.repos.task_repo import TaskRepo


class CreateDocumentHandler:
    def __init__(
        self,
        document_repo: DocumentRepo,
        project_repo: ProjectRepository,
        task_repo: TaskRepo,
        org_membership_facade: OrgMembershipFacade,
        rbac: DocumentRBAC,
    ):
        self.document_repo = document_repo
        self.project_repo = project_repo
        self.task_repo = task_repo
        self.org_membership_facade = org_membership_facade
        self.rbac = rbac

    async def handle(self, cmd: CreateDocumentCommand) -> Document:
        if not cmd.links:
            raise HTTPException(status_code=400, detail="At least one link is required")

        role = await self.org_membership_facade.get_user_role(cmd.user_id, cmd.org_id)
        self.rbac.assert_can_create(role)

        for link in cmd.links:
            await self._validate_link(cmd.org_id, link.target_type, link.target_id)

        document = Document(
            org_id=cmd.org_id,
            title=cmd.title,
            description=cmd.description,
            created_by=cmd.user_id,
            created_at=datetime.now(timezone.utc),
        )
        document.links = [
            DocumentLink(
                org_id=cmd.org_id,
                document_id=document.id,
                target_type=link.target_type,
                target_id=link.target_id,
            )
            for link in cmd.links
        ]

        await self.document_repo.create(document)
        return document

    async def _validate_link(
        self, org_id, target_type: LinkTargetType, target_id
    ) -> None:
        if target_type == LinkTargetType.project:
            project = await self.project_repo.get_by_id(target_id)
            if not project or project.org_id != org_id:
                raise HTTPException(status_code=403, detail="Invalid project link")
        elif target_type == LinkTargetType.task:
            task = await self.task_repo.get_by_id(target_id)
            if not task or task.org_id != org_id:
                raise HTTPException(status_code=403, detail="Invalid task link")
