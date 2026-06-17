# -------------- organization -------------------
from fastapi import Depends
from src.modules.organization.application.facade import OrgMembershipFacade
from src.modules.organization.application.services.org_membership_service import (
    OrgMembershipService,
)
from src.shared.infrastructure.dependencies.auth import get_org_membership_repo


async def get_org_membership_facade(repo=Depends(get_org_membership_repo)):
    org_membership_service = OrgMembershipService(org_membership_repo=repo)

    return OrgMembershipFacade(org_membership_service=org_membership_service)
