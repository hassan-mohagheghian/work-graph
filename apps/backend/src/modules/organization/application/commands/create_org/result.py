from dataclasses import dataclass
from uuid import UUID


@dataclass
class CreateOrgResult:
    id: UUID
