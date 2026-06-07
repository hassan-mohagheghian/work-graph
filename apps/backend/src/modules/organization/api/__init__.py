from fastapi import APIRouter

from .org_router import router as org_router

router = APIRouter()
router.include_router(org_router)
