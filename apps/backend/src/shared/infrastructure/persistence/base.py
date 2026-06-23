import uuid
from datetime import datetime, timezone

from sqlalchemy import TIMESTAMP, Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class IDMixin:
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class CreateAtMixin:
    created_at = Column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class TimestampedMixin:
    created_at = Column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
