from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass
class MilestoneResponse:
    id: UUID
    roadmap_id: UUID
    org_id: UUID
    title: str
    description: str | None
    status: str
    order: int
    created_at: datetime
    updated_at: datetime


@dataclass
class MilestoneListResponse:
    items: list[MilestoneResponse]
