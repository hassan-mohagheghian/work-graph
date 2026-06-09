from dataclasses import dataclass


@dataclass
class OrgItem:
    id: str
    name: str
    role: str


@dataclass
class ListOrgByUserResponse:
    organizations: list[OrgItem]
