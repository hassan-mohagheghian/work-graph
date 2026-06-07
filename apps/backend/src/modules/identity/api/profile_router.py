from fastapi import APIRouter, Depends
from src.modules.identity.application.handlers.fetch_user_profile_handler import (
    FetchUserProfileHandler,
)
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.shared.config.database import AsyncSessionLocal

router = APIRouter(prefix="/user", tags=["user"])


async def get_user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)


@router.get("profile")
async def get_profile(
    email: str,
    repo: SQLAlchemyUserRepository = Depends(get_user_repo),
):
    handler = FetchUserProfileHandler(user_repo=repo)
    profile = await handler.handle(email=email)
    if not profile:
        return {"error": "User not found"}, 404
    return profile
