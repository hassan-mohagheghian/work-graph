from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class CreateOrgResult:
    id: UUID
    name: str
    created_at: datetime
