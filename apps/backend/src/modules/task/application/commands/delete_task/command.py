from dataclasses import dataclass
from uuid import UUID


@dataclass
class DeleteTaskCommand:
    task_id: UUID
    org_id: UUID
    user_id: UUID
