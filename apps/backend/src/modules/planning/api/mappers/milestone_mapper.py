from src.modules.planning.api.schemas.milestone_response import (
    MilestoneListResponse,
    MilestoneResponse,
)
from src.modules.planning.domain.entities.milestone import Milestone


class MilestoneResponseMapper:
    @staticmethod
    def to_response(milestone: Milestone) -> MilestoneResponse:
        return MilestoneResponse(
            id=milestone.id,
            roadmap_id=milestone.roadmap_id,
            org_id=milestone.org_id,
            title=milestone.title,
            description=milestone.description,
            status=milestone.status.value,
            order=milestone.order,
            created_at=milestone.created_at,
            updated_at=milestone.updated_at,
        )


class MilestoneListResponseMapper:
    @staticmethod
    def to_response(milestones: list[Milestone]) -> MilestoneListResponse:
        return MilestoneListResponse(
            items=[MilestoneResponseMapper.to_response(m) for m in milestones]
        )
