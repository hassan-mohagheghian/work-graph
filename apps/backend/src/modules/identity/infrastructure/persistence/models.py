from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import TIMESTAMP
from src.modules.identity.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import IDMixin


class UserModel(IDMixin, Base):
    __table_args__ = {"schema": "identity"}
    __tablename__ = "users"

    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=True)
    display_name = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), nullable=True)
