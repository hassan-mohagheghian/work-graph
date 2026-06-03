from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.application.handlers.register_user_handler import (
    RegisterUerHandler,
)
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.config.database import AsyncSessionLocal

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class RegisterUserRequest(BaseModel):
    email: EmailStr
    display_name: str
    password: str


async def get_user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)


@router.post("/auth/register")
async def register_user(
    req: RegisterUserRequest, repo: SQLAlchemyUserRepository = Depends(get_user_repo)
):
    handler = RegisterUerHandler(repo)
    command = RegisterUserCommand(
        email=req.email,
        display_name=req.display_name,
        password_hash=req.password,  # for MVP, hash later
    )
    user = await handler.handle(command=command)
    return {
        "id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
    }
