# import uuid
# from datetime import datetime

# import pytest
# from src.modules.organization.application.commands.create_membership.command import (
#     CreateMembershipCommand,
# )
# from src.modules.organization.application.commands.create_membership.handler import (
#     CreateOrgMembershipHandler,
# )
# from src.modules.organization.application.commands.create_membership.result import (
#     CreateMembershipResult,
# )
# from src.modules.organization.domain.value_objects import OrgRole


# @pytest.mark.asyncio
# async def test_create_membership_success(org_membership_repo):
#     # -------------------------
#     # Arrange
#     # -------------------------
#     handler = CreateOrgMembershipHandler(repo=org_membership_repo)

#     organization_id = uuid.uuid4()
#     user_id = uuid.uuid4()

#     cmd = CreateMembershipCommand(
#         org_id=organization_id,
#         user_id=user_id,
#         role="owner",
#     )

#     # -------------------------
#     # Act
#     # -------------------------
#     result: CreateMembershipResult = await handler.handle(cmd)

#     # -------------------------
#     # Assert
#     # -------------------------
#     assert result.org_id == organization_id
#     assert result.user_id == user_id
#     assert result.role == OrgRole.OWNER.name
#     assert result.id is not None
#     assert isinstance(result.created_at, datetime)
#     assert isinstance(result, CreateMembershipResult)
