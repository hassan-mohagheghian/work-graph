from dataclasses import dataclass
from uuid import UUID


@dataclass
class ReorderTasksCommand:
    project_id: UUID
    org_id: UUID
    ordered_ids: list[UUID]
