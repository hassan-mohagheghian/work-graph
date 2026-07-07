from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from src.modules.planning.domain.value_objects.milestone_status import MilestoneStatus


@dataclass
class UpdateMilestoneCommand:
    org_id: UUID
    milestone_id: UUID
    user_id: UUID
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[MilestoneStatus] = None
    order: Optional[int] = None
