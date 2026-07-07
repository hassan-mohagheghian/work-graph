from src.modules.planning.api.schemas.roadmap_response import (
    RoadmapListResponse,
    RoadmapResponse,
)
from src.modules.planning.domain.entities.roadmap import Roadmap


class RoadmapResponseMapper:
    @staticmethod
    def to_response(roadmap: Roadmap) -> RoadmapResponse:
        return RoadmapResponse(
            id=roadmap.id,
            project_id=roadmap.project_id,
            org_id=roadmap.org_id,
            title=roadmap.title,
            description=roadmap.description,
            status=roadmap.status.value,
            created_at=roadmap.created_at,
            updated_at=roadmap.updated_at,
        )


class RoadmapListResponseMapper:
    @staticmethod
    def to_response(roadmaps: list[Roadmap]) -> RoadmapListResponse:
        return RoadmapListResponse(
            items=[RoadmapResponseMapper.to_response(r) for r in roadmaps]
        )
