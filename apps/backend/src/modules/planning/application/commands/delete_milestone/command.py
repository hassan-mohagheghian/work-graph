from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteMilestoneCommand:
    milestone_id: UUID
    org_id: UUID
    user_id: UUID
