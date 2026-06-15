from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetMeQuery:
    user_id: UUID
