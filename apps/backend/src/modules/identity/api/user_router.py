from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from src.modules.identity.api.auth_router import RegisterUserRequest
from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.application.commands.register_user_handler import (
    RegisterUerHandler,
)
from src.modules.identity.application.queries.get_me.handler import GetMeQueryHandler
from src.modules.identity.application.queries.get_me.query import GetMeQuery
from src.modules.identity.application.queries.get_user_profile.handler import (
    FetchUserProfileHandler,
)
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)
from src.modules.organization.api.org_router import get_org_repo
from src.shared.config.database import AsyncSessionLocal
from src.shared.infrastructure.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["users"])


async def get_user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)


@router.post("/register")
async def register_user(
    req: RegisterUserRequest,
    repo: SQLAlchemyUserRepository = Depends(get_user_repo),
):
    handler = RegisterUerHandler(repo, password_hasher=Argon2PasswordHasher())
    command = RegisterUserCommand(
        email=req.email,
        display_name=req.display_name,
        password=req.password,
    )
    user = await handler.handle(command=command)
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
    }


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
async def get_me(
    user_id: str = Depends(get_current_user_id),
    repo: SQLAlchemyUserRepository = Depends(get_org_repo),
):
    handler = GetMeQueryHandler(org_repo=repo)
    query = GetMeQuery(user_id=user_id)
    response = await handler.handle(query=query)
    if not response:
        HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    return response
