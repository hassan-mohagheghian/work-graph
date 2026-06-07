from fastapi import FastAPI
from src.modules.identity.api import router as identity_router
from src.modules.organization.api import router as org_router


def register_routers(app: FastAPI) -> None:
    app.include_router(identity_router)
    app.include_router(org_router)
