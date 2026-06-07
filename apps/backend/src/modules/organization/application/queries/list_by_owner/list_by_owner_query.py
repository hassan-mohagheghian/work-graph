from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListOrgsByOwnerQuery:
    owner_id: UUID
