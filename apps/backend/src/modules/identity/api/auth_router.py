from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.application.handlers.login_user_handler import (
    LoginUserHandler,
)
from src.modules.identity.application.handlers.register_user_handler import (
    RegisterUerHandler,
)
from src.modules.identity.application.queries.login_user_query import LoginUserQuery
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)
from src.modules.identity.infrastructure.token.jwt_token_provider import (
    JWTTokenProvider,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.config.settings import settings

# I want it takes email and password in body

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class RegisterUserRequest(BaseModel):
    email: EmailStr
    display_name: str
    password: str


class LoginUserRequest(BaseModel):
    username: EmailStr
    password: str


async def get_user_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyUserRepository(session=session)


async def get_password_hasher():
    Argon2PasswordHasher


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


@router.post("/login")
async def login_user(
    req: OAuth2PasswordRequestForm = Depends(),
    repo: SQLAlchemyUserRepository = Depends(get_user_repo),
):
    handler = LoginUserHandler(
        user_repo=repo,
        password_hasher=Argon2PasswordHasher(),
        token_provider=JWTTokenProvider(
            secret_key=settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        ),
    )
    query = LoginUserQuery(email=req.username, password=req.password)
    return await handler.handle(query=query)
