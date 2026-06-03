from fastapi import FastAPI

from src.modules.identity.presentation.api.auth import router as auth_router
from src.modules.identity.presentation.api.profile import router as profile_router


def register_routers(app: FastAPI) -> None:
    app.include_router(auth_router)
    app.include_router(profile_router)
