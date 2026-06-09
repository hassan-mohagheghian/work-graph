from dataclasses import dataclass
from uuid import UUID


@dataclass
class ListOrgsByUserQuery:
    user_id: UUID
