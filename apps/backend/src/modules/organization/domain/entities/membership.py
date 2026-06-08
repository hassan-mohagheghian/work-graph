import uuid
from datetime import datetime
from uuid import UUID

from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.shared.domain.entity import Entity


class OrgMembership(Entity):
    def __init__(
        self,
        org_id: UUID,
        user_id: UUID,
        role: OrgRole,
        id: uuid.UUID | None = None,
        created_at: datetime | None = None,
    ):
        super().__init__(id=id)
        self.org_id = org_id
        self.user_id = user_id
        self.role = role
        self.created_at = created_at
