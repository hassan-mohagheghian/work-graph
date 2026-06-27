from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.modules.knowledge.domain.entities.attachment import Attachment
from src.modules.knowledge.domain.repos.attachment_repo import AttachmentRepo
from src.modules.knowledge.infrastructure.persistence.models import AttachmentModel


class SqlAlchemyAttachmentRepo(AttachmentRepo):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, attachment: Attachment) -> None:
        self.session.add(
            AttachmentModel(
                id=attachment.id,
                org_id=attachment.org_id,
                document_id=attachment.document_id,
                filename=attachment.filename,
                content_type=attachment.content_type,
                size_bytes=attachment.size_bytes,
                storage_key=attachment.storage_key,
                created_at=attachment.created_at,
            )
        )
        await self.session.commit()

    async def get_by_id(self, attachment_id: UUID) -> Attachment | None:
        result = await self.session.execute(
            select(AttachmentModel).where(AttachmentModel.id == attachment_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            return None
        return self._to_entity(model)

    async def list_by_document(self, document_id: UUID) -> list[Attachment]:
        result = await self.session.execute(
            select(AttachmentModel).where(AttachmentModel.document_id == document_id)
        )
        return [self._to_entity(row) for row in result.scalars().all()]

    async def delete(self, attachment_id: UUID) -> None:
        await self.session.execute(
            delete(AttachmentModel).where(AttachmentModel.id == attachment_id)
        )
        await self.session.commit()

    async def delete_by_document(self, document_id: UUID) -> list[Attachment]:
        result = await self.session.execute(
            select(AttachmentModel).where(AttachmentModel.document_id == document_id)
        )
        attachments = [self._to_entity(row) for row in result.scalars().all()]
        await self.session.execute(
            delete(AttachmentModel).where(AttachmentModel.document_id == document_id)
        )
        await self.session.commit()
        return attachments

    def _to_entity(self, model: AttachmentModel) -> Attachment:
        return Attachment(
            id=model.id,
            org_id=model.org_id,
            document_id=model.document_id,
            filename=model.filename,
            content_type=model.content_type,
            size_bytes=model.size_bytes,
            storage_key=model.storage_key,
            created_at=model.created_at,
        )
