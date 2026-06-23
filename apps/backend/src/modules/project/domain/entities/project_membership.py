from dataclasses import dataclass
from uuid import UUID

from src.modules.shared.domain.entity_v1 import CreatedAtMixin, Entity


@dataclass(eq=False)
class ProjectMembership(Entity, CreatedAtMixin):
    project_id: UUID
    org_id: UUID
    user_id: UUID
    role: str = "member"  # member | admin | owner
