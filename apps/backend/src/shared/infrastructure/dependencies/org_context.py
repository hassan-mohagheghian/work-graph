from uuid import UUID

from fastapi import Depends, HTTPException, Query, status
from src.modules.organization.domain.repositories.org_membership_repo import (
    OrgMembershipRepo,
)
from src.shared.infrastructure.dependencies.auth import (
    get_current_user_id,
    get_org_membership_repo,
)


async def get_current_org_id(
    org_id: UUID,
    user_id: str = Depends(get_current_user_id),
    membership_repo: OrgMembershipRepo = Depends(get_org_membership_repo),
) -> UUID:
    is_member = await membership_repo.exists(org_id=org_id, user_id=user_id)

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Allowed",
        )

    return org_id


async def get_current_org_id_v1(
    org_id: str = Query(),
    user_id: str = Depends(get_current_user_id),
    membership_repo: OrgMembershipRepo = Depends(get_org_membership_repo),
) -> UUID:
    is_member = await membership_repo.exists(org_id=org_id, user_id=user_id)

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not Allowed",
        )

    return org_id
