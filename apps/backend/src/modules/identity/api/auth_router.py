from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from src.modules.identity.application.queries.login_user.handler import (
    LoginUserHandler,
)
from src.modules.identity.application.queries.login_user.query import LoginUserQuery
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


router = APIRouter(prefix="/auth", tags=["auth"])


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


@router.post("/login")
async def login(
    response: Response,
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

    result = await handler.handle(query=query)
    response.set_cookie(
        key="access_token",
        value=result.access_token,
        httponly=True,
        secure=False,  # True in production
        samesite="lax",
        max_age=60 * 60 * 24,
    )
    return result


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "logged out"}
