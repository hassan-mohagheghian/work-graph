from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListTasksQuery:
    project_id: UUID
