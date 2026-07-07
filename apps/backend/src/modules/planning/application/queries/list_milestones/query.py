from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListMilestonesQuery:
    org_id: UUID
    roadmap_id: UUID
