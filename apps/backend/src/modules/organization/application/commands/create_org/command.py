from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateOrgCommand:
    name: str
    owner_id: UUID
