from uuid import UUID

from sqlalchemy import delete, desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from src.modules.knowledge.domain.entities.attachment import Attachment
from src.modules.knowledge.domain.entities.document import Document
from src.modules.knowledge.domain.entities.document_link import DocumentLink
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.knowledge.infrastructure.persistence.models import (
    AttachmentModel,
    DocumentLinkModel,
    DocumentModel,
)


class SqlAlchemyDocumentRepo(DocumentRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, document: Document) -> None:
        model = DocumentModel(
            id=document.id,
            org_id=document.org_id,
            title=document.title,
            description=document.description,
            created_by=document.created_by,
            created_at=document.created_at,
            updated_at=document.updated_at,
        )
        self.session.add(model)

        for link in document.links:
            self.session.add(
                DocumentLinkModel(
                    id=link.id,
                    org_id=link.org_id,
                    document_id=document.id,
                    target_type=link.target_type,
                    target_id=link.target_id,
                    created_at=link.created_at,
                )
            )

        await self.session.commit()

    async def get_by_id(self, document_id: UUID) -> Document | None:
        result = await self.session.execute(
            select(DocumentModel)
            .options(
                selectinload(DocumentModel.links),
                selectinload(DocumentModel.attachments),
            )
            .where(DocumentModel.id == document_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_entity(model)

    async def update(self, document: Document) -> None:
        result = await self.session.execute(
            select(DocumentModel).where(DocumentModel.id == document.id)
        )
        model = result.scalar_one_or_none()
        if not model:
            raise ValueError("Document not found")

        model.title = document.title
        model.description = document.description
        model.updated_at = document.updated_at
        await self.session.commit()

    async def delete(self, document_id: UUID) -> None:
        await self.session.execute(
            delete(DocumentModel).where(DocumentModel.id == document_id)
        )
        await self.session.commit()

    async def list(
        self,
        org_id: UUID,
        target_type: LinkTargetType | None = None,
        target_id: UUID | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[Document]:
        stmt = (
            select(DocumentModel)
            .options(
                selectinload(DocumentModel.links),
                selectinload(DocumentModel.attachments),
            )
            .where(DocumentModel.org_id == org_id)
        )

        if target_type and target_id:
            stmt = stmt.join(DocumentLinkModel).where(
                DocumentLinkModel.target_type == target_type,
                DocumentLinkModel.target_id == target_id,
            )

        stmt = stmt.order_by(desc(DocumentModel.created_at)).limit(limit).offset(offset)

        result = await self.session.execute(stmt)
        return [self._to_entity(row) for row in result.scalars().unique().all()]

    def _to_entity(self, model: DocumentModel) -> Document:
        return Document(
            id=model.id,
            org_id=model.org_id,
            title=model.title,
            description=model.description,
            created_by=model.created_by,
            created_at=model.created_at,
            updated_at=model.updated_at,
            links=[
                DocumentLink(
                    id=link.id,
                    org_id=link.org_id,
                    document_id=link.document_id,
                    target_type=link.target_type,
                    target_id=link.target_id,
                    created_at=link.created_at,
                )
                for link in model.links
            ],
            attachments=[
                Attachment(
                    id=att.id,
                    org_id=att.org_id,
                    document_id=att.document_id,
                    filename=att.filename,
                    content_type=att.content_type,
                    size_bytes=att.size_bytes,
                    storage_key=att.storage_key,
                    created_at=att.created_at,
                )
                for att in model.attachments
            ],
        )
