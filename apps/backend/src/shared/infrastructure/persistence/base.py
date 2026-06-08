import uuid

from sqlalchemy import TIMESTAMP, Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class UUIDMixin:
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())


class CreateAtMixin:
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
