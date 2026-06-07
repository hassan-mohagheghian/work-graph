from dataclasses import dataclass


@dataclass
class GetOrgResponse:
    id: str
    name: str
    owner_id: str
