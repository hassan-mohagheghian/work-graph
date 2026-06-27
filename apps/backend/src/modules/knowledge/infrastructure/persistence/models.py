from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from src.modules.knowledge.domain.value_objects.link_target_type import LinkTargetType
from src.modules.knowledge.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import (
    CreateAtMixin,
    IDMixin,
    TimestampedMixin,
)


class DocumentModel(IDMixin, TimestampedMixin, Base):
    __table_args__ = {"schema": "knowledge"}
    __tablename__ = "documents"

    org_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    created_by = Column(PG_UUID(as_uuid=True), nullable=True)

    links = relationship(
        "DocumentLinkModel",
        back_populates="document",
        cascade="all, delete-orphan",
    )
    attachments = relationship(
        "AttachmentModel",
        back_populates="document",
        cascade="all, delete-orphan",
    )


class DocumentLinkModel(IDMixin, CreateAtMixin, Base):
    __table_args__ = (
        UniqueConstraint(
            "document_id",
            "target_type",
            "target_id",
            name="uq_document_link_target",
        ),
        {"schema": "knowledge"},
    )
    __tablename__ = "document_links"

    org_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)
    document_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("knowledge.documents.id", ondelete="CASCADE"),
        nullable=False,
    )
    target_type = Column(
        SAEnum(
            LinkTargetType,
            name="link_target_type",
            schema="knowledge",
            create_type=False,
        ),
        nullable=False,
    )
    target_id = Column(PG_UUID(as_uuid=True), nullable=False)

    document = relationship("DocumentModel", back_populates="links")


class AttachmentModel(IDMixin, CreateAtMixin, Base):
    __table_args__ = {"schema": "knowledge"}
    __tablename__ = "attachments"

    org_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)
    document_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("knowledge.documents.id", ondelete="CASCADE"),
        nullable=False,
    )
    filename = Column(String(255), nullable=False)
    content_type = Column(String(127), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    storage_key = Column(String(512), nullable=False)

    document = relationship("DocumentModel", back_populates="attachments")
