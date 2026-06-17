from src.modules.organization.application.services.org_membership_service import (
    OrgMembershipService,
)


class OrgMembershipFacade:
    def __init__(self, org_membership_service: OrgMembershipService):
        self.membership_service = org_membership_service

    async def get_user_role(self, user_id, org_id):
        return await self.membership_service.get_user_role(user_id, org_id)
