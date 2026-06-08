from dataclasses import dataclass


@dataclass
class CreateMembershipResult:
    id: str
    org_id: str
    user_id: str
    role: str
    created_at: str
