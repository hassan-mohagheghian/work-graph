from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetTaskQuery:
    task_id: UUID
    org_id: UUID
