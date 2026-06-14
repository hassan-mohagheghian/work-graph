from uuid import UUID

from fastapi import APIRouter, Depends
from src.modules.identity.application.handlers.fetch_user_profile_handler import (
    FetchUserProfileHandler,
)
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["users"])


async def get_user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)


@router.get("/profile")
async def get_profile(
    repo: SQLAlchemyUserRepository = Depends(get_user_repo),
    user_id: str = Depends(get_current_user_id),
):
    handler = FetchUserProfileHandler(user_repo=repo)
    profile = await handler.handle(id=UUID(user_id))
    if not profile:
        return {"error": "User not found"}, 404
    return profile


@router.get("/me")
async def me(
    user_id: str = Depends(get_current_user_id),
):
    return {"id": user_id}
