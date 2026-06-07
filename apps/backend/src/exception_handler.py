from fastapi import Request, status
from fastapi.responses import JSONResponse
from src.modules.identity.domain.exceptions import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
)
from src.modules.organization.domain.exceptions import OrganizationNotFoundError


def register_exception_handlers(app):
    @app.exception_handler(InvalidCredentialsError)
    async def invalid_credentials_handler(
        request: Request, exc: InvalidCredentialsError
    ):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": str(exc) or "Invalid email or password"},
        )

    @app.exception_handler(UserAlreadyExistsError)
    async def user_already_exists_handler(
        request: Request, exc: UserAlreadyExistsError
    ):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": str(exc) or "User already exists"},
        )

    @app.exception_handler(UserAlreadyExistsError)
    async def org_not_found_handler(request: Request, exc: OrganizationNotFoundError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc) or "Organization not found"},
        )
