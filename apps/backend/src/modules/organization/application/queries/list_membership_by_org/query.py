from dataclasses import dataclass
from uuid import UUID


@dataclass
class OrgMembersQuery:
    org_id: UUID
