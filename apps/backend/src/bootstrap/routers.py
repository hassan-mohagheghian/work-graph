from fastapi import FastAPI

from src.modules.identity.presentation.api.auth import router as auth_router
from src.modules.identity.presentation.api.profile import router as profile_router
from src.modules.org.interface.http.org_router import router as org_router


def register_routers(app: FastAPI) -> None:
    app.include_router(auth_router)
    app.include_router(profile_router)
    app.include_router(org_router)
