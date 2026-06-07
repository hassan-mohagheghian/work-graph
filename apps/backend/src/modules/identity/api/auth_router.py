from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from src.modules.identity.application.handlers.login_user_handler import (
    LoginUserHandler,
)
from src.modules.identity.application.queries.login_user_query import LoginUserQuery
from src.modules.identity.infrastructure.security.argon2_password_hasher import (
    Argon2PasswordHasher,
)
from src.modules.identity.application.commands.register_user import RegisterUserCommand
from src.modules.identity.application.handlers.register_user_handler import (
    RegisterUerHandler,
)
from src.modules.identity.infrastructure.persistence.sqlalchemy_user_repository import (
    SQLAlchemyUserRepository,
)
from src.config.database import AsyncSessionLocal
from src.modules.identity.infrastructure.token.jwt_token_provider import (
    JWTTokenProvider,
)
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt

# I want it takes email and password in body

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

secret_key = "sdfkj3l4j200()&*^&23jkjfkdfkjfkjwekr&*372jkjfkdf"


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        user_id: str = payload.get("sub")  # 'sub' is usually user ID in JWT
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


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
        token_provider=JWTTokenProvider(secret_key=secret_key),
    )
    query = LoginUserQuery(email=req.username, password=req.password)
    return await handler.handle(query=query)
