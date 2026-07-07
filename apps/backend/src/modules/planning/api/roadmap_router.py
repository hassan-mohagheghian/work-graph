from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from src.modules.planning.api.mappers.roadmap_mapper import (
    RoadmapListResponseMapper,
    RoadmapResponseMapper,
)
from src.modules.planning.application.commands.activate_roadmap.command import (
    ActivateRoadmapCommand,
)
from src.modules.planning.application.commands.activate_roadmap.handler import (
    ActivateRoadmapHandler,
)
from src.modules.planning.application.commands.create_roadmap.command import (
    CreateRoadmapCommand,
)
from src.modules.planning.application.commands.create_roadmap.handler import (
    CreateRoadmapHandler,
)
from src.modules.planning.application.commands.delete_roadmap.command import (
    DeleteRoadmapCommand,
)
from src.modules.planning.application.commands.delete_roadmap.handler import (
    DeleteRoadmapHandler,
)
from src.modules.planning.application.commands.update_roadmap.command import (
    UpdateRoadmapCommand,
)
from src.modules.planning.application.commands.update_roadmap.handler import (
    UpdateRoadmapHandler,
)
from src.modules.planning.application.queries.get_roadmap.handler import (
    GetRoadmapHandler,
)
from src.modules.planning.application.queries.get_roadmap.query import GetRoadmapQuery
from src.modules.planning.application.queries.list_roadmaps.handler import (
    ListRoadmapsHandler,
)
from src.modules.planning.application.queries.list_roadmaps.query import (
    ListRoadmapsQuery,
)
from src.modules.planning.domain.value_objects.roadmap_status import RoadmapStatus
from src.modules.planning.infrastructure.persistence.sqlalchemy_roadmap_repo import (
    SqlAlchemyRoadmapRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id
from src.shared.infrastructure.dependencies.org_context import (
    get_current_org_id,
    get_current_org_id_v1,
)

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


async def get_roadmap_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyRoadmapRepo(session=session)


class CreateRoadmapRequest(BaseModel):
    project_id: UUID
    title: str
    description: str | None = None


@router.post("")
async def create_roadmap(
    body: CreateRoadmapRequest,
    roadmap_repo=Depends(get_roadmap_repo),
    org_id=Depends(get_current_org_id_v1),
    user_id: UUID = Depends(get_current_user_id),
):
    handler = CreateRoadmapHandler(roadmap_repo)
    return await handler.handle(
        CreateRoadmapCommand(
            org_id=org_id,
            project_id=body.project_id,
            title=body.title,
            description=body.description,
            creator_id=user_id,
        )
    )


@router.get("")
async def list_roadmaps(
    project_id: UUID | None = None,
    status: str | None = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    org_id=Depends(get_current_org_id),
    roadmap_repo=Depends(get_roadmap_repo),
):
    handler = ListRoadmapsHandler(roadmap_repo=roadmap_repo)
    query = ListRoadmapsQuery(
        org_id=org_id,
        project_id=project_id,
        status=status,
        limit=limit,
        offset=offset,
    )
    result = await handler.handle(query)
    return RoadmapListResponseMapper.to_response(result)


@router.get("/{roadmap_id}")
async def get_roadmap(
    roadmap_id: UUID,
    org_id=Depends(get_current_org_id),
    roadmap_repo=Depends(get_roadmap_repo),
):
    handler = GetRoadmapHandler(roadmap_repo=roadmap_repo)
    result = await handler.handle(GetRoadmapQuery(roadmap_id=roadmap_id, org_id=org_id))
    return RoadmapResponseMapper.to_response(result)


class UpdateRoadmapRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    status: RoadmapStatus | None = None


@router.patch("/{roadmap_id}")
async def update_roadmap(
    roadmap_id: UUID,
    body: UpdateRoadmapRequest,
    user_id: UUID = Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    roadmap_repo=Depends(get_roadmap_repo),
):
    handler = UpdateRoadmapHandler(roadmap_repo=roadmap_repo)
    return await handler.handle(
        UpdateRoadmapCommand(
            org_id=org_id,
            roadmap_id=roadmap_id,
            user_id=user_id,
            title=body.title,
            description=body.description,
            status=body.status,
        )
    )


@router.post("/{roadmap_id}/activate")
async def activate_roadmap(
    roadmap_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    roadmap_repo=Depends(get_roadmap_repo),
):
    handler = ActivateRoadmapHandler(roadmap_repo=roadmap_repo)
    return await handler.handle(
        ActivateRoadmapCommand(
            roadmap_id=roadmap_id,
            org_id=org_id,
            user_id=user_id,
        )
    )


@router.delete("/{roadmap_id}")
async def delete_roadmap(
    roadmap_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    org_id: UUID = Depends(get_current_org_id),
    roadmap_repo=Depends(get_roadmap_repo),
):
    handler = DeleteRoadmapHandler(roadmap_repo=roadmap_repo)
    await handler.handle(
        DeleteRoadmapCommand(roadmap_id=roadmap_id, org_id=org_id, user_id=user_id)
    )
    return {"status": "deleted"}
