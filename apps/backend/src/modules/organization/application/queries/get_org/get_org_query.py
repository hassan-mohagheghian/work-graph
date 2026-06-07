from dataclasses import dataclass
from uuid import UUID


@dataclass
class GetOrgQuery:
    org_id: UUID
