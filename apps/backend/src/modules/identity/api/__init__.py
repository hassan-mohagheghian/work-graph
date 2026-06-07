from fastapi import APIRouter

from .auth_router import router as auth_router
from .profile_router import router as profile_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(profile_router)
