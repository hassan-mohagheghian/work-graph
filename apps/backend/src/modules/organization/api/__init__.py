from fastapi import APIRouter

from .org_membership_router import router as org_membership_router
from .org_router import router as org_router

router = APIRouter()
router.include_router(org_router)
router.include_router(org_membership_router)
