import jwt
from fastapi import Cookie, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
from src.modules.organization.domain.entities.membership import OrgMembership
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.modules.organization.domain.value_objects.role import OrgRole
from src.modules.organization.infrastructure.persistence.sqlalchemy_membership_repo import (
    SQLAlchemyOrgMembershipRepo,
)
from src.shared.config.database import AsyncSessionLocal
from src.shared.config.settings import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_org_membership_repo():
    async with AsyncSessionLocal() as session:
        yield SQLAlchemyOrgMembershipRepo(session=session)


def get_current_user_id(access_token: str | None = Cookie(None)) -> str:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(
            access_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")  # 'sub' is usually user ID in JWT
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_org_role(required_role: OrgRole) -> OrgMembership:
    async def dependency(
        org_id: str,
        current_user_id: str = Depends(get_current_user_id),
        membership_repo: OrgMembershipRepo = Depends(get_org_membership_repo),
    ):
        membership = await membership_repo.get_by_user_and_org(
            user_id=current_user_id,
            org_id=org_id,
        )

        if not membership:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this organization",
            )

        if membership.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role {required_role}",
            )

        return membership

    return dependency
