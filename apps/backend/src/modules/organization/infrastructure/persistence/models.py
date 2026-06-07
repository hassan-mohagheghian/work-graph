import uuid

from sqlalchemy import TIMESTAMP, Column, String

from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from src.shared.infrastructure.persistence.base import Base, UUIDMixin


class OrganizationModel(UUIDMixin, Base):
    __tablename__ = "organizations"

    name = Column(String(200), unique=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    owner_id: uuid.UUID = Column(PG_UUID(as_uuid=True), nullable=False)
