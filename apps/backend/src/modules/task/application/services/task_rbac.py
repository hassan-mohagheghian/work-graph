from fastapi import HTTPException
from src.modules.organization.domain.value_objects import OrgRole


class TaskRBAC:
    def assert_can_update(self, role: OrgRole):
        if role not in {OrgRole.OWNER, OrgRole.ADMIN}:
            raise HTTPException(403)

    def assert_can_create(self, role: OrgRole):
        if role not in {OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER}:
            raise HTTPException(403)

    def assert_can_delete(self, role: OrgRole):
        if role != OrgRole.OWNER:
            raise HTTPException(403)
