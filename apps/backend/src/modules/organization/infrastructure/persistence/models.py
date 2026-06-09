from sqlalchemy import Column, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.modules.organization.infrastructure.persistence.base import Base
from src.shared.infrastructure.persistence.base import CreateAtMixin, UUIDMixin


class OrganizationModel(UUIDMixin, CreateAtMixin, Base):
    __table_args__ = {"schema": "org"}
    __tablename__ = "organizations"

    name = Column(String(200), unique=True, nullable=False)


class OrgMembershipModel(UUIDMixin, CreateAtMixin, Base):
    __table_args__ = (
        UniqueConstraint(
            "org_id",
            "user_id",
            name="uq_org_membership_org_user",
        ),
        {"schema": "org"},
    )
    __tablename__ = "organization_memberships"

    org_id = Column(PG_UUID(as_uuid=True), index=True, nullable=False)
    user_id = Column(PG_UUID(as_uuid=True), index=True, nullable=False)
    role = Column(String, nullable=False)
