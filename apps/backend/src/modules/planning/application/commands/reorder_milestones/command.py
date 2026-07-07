from dataclasses import dataclass, field
from uuid import UUID


@dataclass
class ReorderMilestonesCommand:
    org_id: UUID
    roadmap_id: UUID
    user_id: UUID
    ordered_ids: list[UUID] = field(default_factory=list)
