from dataclasses import dataclass
from uuid import UUID


@dataclass
class UpdateOrgCommand:
    org_id: UUID
    name: str | None = None
