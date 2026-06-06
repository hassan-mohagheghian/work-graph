import uuid

from psycopg import Column
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class UUIDMixin:
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4())
