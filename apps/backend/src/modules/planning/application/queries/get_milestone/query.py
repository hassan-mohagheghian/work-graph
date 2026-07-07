from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetMilestoneQuery:
    milestone_id: UUID
    org_id: UUID
