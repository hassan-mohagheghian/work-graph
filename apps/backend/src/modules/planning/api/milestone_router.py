from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from src.modules.planning.api.mappers.milestone_mapper import (
    MilestoneListResponseMapper,
    MilestoneResponseMapper,
)
from src.modules.planning.application.commands.create_milestone.command import (
    CreateMilestoneCommand,
)
from src.modules.planning.application.commands.create_milestone.handler import (
    CreateMilestoneHandler,
)
from src.modules.planning.application.commands.delete_milestone.command import (
    DeleteMilestoneCommand,
)
from src.modules.planning.application.commands.delete_milestone.handler import (
    DeleteMilestoneHandler,
)
from src.modules.planning.application.commands.reorder_milestones.command import (
    ReorderMilestonesCommand,
)
from src.modules.planning.application.commands.reorder_milestones.handler import (
    ReorderMilestonesHandler,
)
from src.modules.planning.application.commands.update_milestone.command import (
    UpdateMilestoneCommand,
)
from src.modules.planning.application.commands.update_milestone.handler import (
    UpdateMilestoneHandler,
)
from src.modules.planning.application.queries.get_milestone.handler import (
    GetMilestoneHandler,
)
from src.modules.planning.application.queries.get_milestone.query import (
    GetMilestoneQuery,
)
from src.modules.planning.application.queries.list_milestones.handler import (
    ListMilestonesHandler,
)
from src.modules.planning.application.queries.list_milestones.query import (
    ListMilestonesQuery,
)
from src.modules.planning.domain.value_objects.milestone_status import MilestoneStatus
from src.modules.planning.infrastructure.persistence.sqlalchemy_milestone_repo import (
    SqlAlchemyMilestoneRepo,
)
from src.modules.planning.infrastructure.persistence.sqlalchemy_roadmap_repo import (
    SqlAlchemyRoadmapRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id
from src.shared.infrastructure.dependencies.org_context import (
    get_current_org_id,
    get_current_org_id_v1,
)

router = APIRouter(prefix="/milestones", tags=["milestones"])


async def get_milestone_repo():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyMilestoneRepo(session=session)


async def get_roadmap_repo_for_milestones():
    async with AsyncSessionLocal() as session:
        yield SqlAlchemyRoadmapRepo(session=session)


class CreateMilestoneRequest(BaseModel):
    roadmap_id: UUID
    title: str
    description: str | None = None
    order: int = 0


@router.post("")
async def create_milestone(
    body: CreateMilestoneRequest,
    milestone_repo=Depends(get_milestone_repo),
    roadmap_repo=Depends(get_roadmap_repo_for_milestones),
    org_id=Depends(get_current_org_id_v1),
    user_id: UUID = Depends(get_current_user_id),
):
    handler = CreateMilestoneHandler(milestone_repo, roadmap_repo)
    return await handler.handle(
        CreateMilestoneCommand(
            org_id=org_id,
            roadmap_id=body.roadmap_id,
            title=body.title,
            description=body.description,
            order=body.order,
            creator_id=user_id,
        )
    )


@router.get("/roadmap/{roadmap_id}")
async def list_milestones(
    roadmap_id: UUID,
    org_id=Depends(get_current_org_id),
    milestone_repo=Depends(get_milestone_repo),
    roadmap_repo=Depends(get_roadmap_repo_for_milestones),
):
    handler = ListMilestonesHandler(milestone_repo, roadmap_repo)
    result = await handler.handle(
        ListMilestonesQuery(org_id=org_id, roadmap_id=roadmap_id)
    )
    return MilestoneListResponseMapper.to_response(result)


@router.get("/{milestone_id}")
async def get_milestone(
    milestone_id: UUID,
    org_id=Depends(get_current_org_id),
    milestone_repo=Depends(get_milestone_repo),
):
    handler = GetMilestoneHandler(milestone_repo)
    result = await handler.handle(
        GetMilestoneQuery(milestone_id=milestone_id, org_id=org_id)
    )
    return MilestoneResponseMapper.to_response(result)


class UpdateMilestoneRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    status: MilestoneStatus | None = None
    order: int | None = None


@router.patch("/{milestone_id}")
async def update_milestone(
    milestone_id: UUID,
    body: UpdateMilestoneRequest,
    user_id: UUID = Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    milestone_repo=Depends(get_milestone_repo),
):
    handler = UpdateMilestoneHandler(milestone_repo)
    return await handler.handle(
        UpdateMilestoneCommand(
            org_id=org_id,
            milestone_id=milestone_id,
            user_id=user_id,
            title=body.title,
            description=body.description,
            status=body.status,
            order=body.order,
        )
    )


class ReorderMilestonesRequest(BaseModel):
    ordered_ids: list[UUID]


@router.post("/roadmap/{roadmap_id}/reorder")
async def reorder_milestones(
    roadmap_id: UUID,
    body: ReorderMilestonesRequest,
    user_id: UUID = Depends(get_current_user_id),
    org_id=Depends(get_current_org_id),
    milestone_repo=Depends(get_milestone_repo),
    roadmap_repo=Depends(get_roadmap_repo_for_milestones),
):
    handler = ReorderMilestonesHandler(milestone_repo, roadmap_repo)
    result = await handler.handle(
        ReorderMilestonesCommand(
            org_id=org_id,
            roadmap_id=roadmap_id,
            user_id=user_id,
            ordered_ids=body.ordered_ids,
        )
    )
    return MilestoneListResponseMapper.to_response(result)


@router.delete("/{milestone_id}")
async def delete_milestone(
    milestone_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    org_id: UUID = Depends(get_current_org_id),
    milestone_repo=Depends(get_milestone_repo),
):
    handler = DeleteMilestoneHandler(milestone_repo)
    await handler.handle(
        DeleteMilestoneCommand(
            milestone_id=milestone_id, org_id=org_id, user_id=user_id
        )
    )
    return {"status": "deleted"}
