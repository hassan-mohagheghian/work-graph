from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListProjectsQuery:
    org_id: UUID
