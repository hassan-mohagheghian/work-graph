from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class CreateProjectResult:
    id: UUID
    org_id: UUID
    name: str
    description: str
    created_at: datetime
