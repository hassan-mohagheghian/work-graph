from dataclasses import dataclass
from datetime import datetime


@dataclass
class OrgItem:
    id: str
    name: str
    created_at: datetime


@dataclass
class ListOrgByOwnerResponse:
    organizations: list[OrgItem]
