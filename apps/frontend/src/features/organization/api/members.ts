import { api } from "@/shared/lib/api";

export type Role = "owner" | "admin" | "member";

export type OrgMember = {
  user_id: string;
  email: string;
  role: Role;
};

export async function getMembers(orgId: string) {
  const res = await api.get(`/organizations/${orgId}/members`);
  return res.data.members as OrgMember[];
}

export async function updateMemberRole(
  orgId: string,
  userId: string,
  role: Role,
) {
  const res = await api.patch(`/organizations/${orgId}/members/${userId}`, {
    role,
  });
  return res.data;
}

export async function removeMember(orgId: string, userId: string) {
  const res = await api.delete(`/organizations/${orgId}/members/${userId}`);
  return res.data;
}

export async function addMember(orgId: string, email: string, role: Role) {
  const res = await api.post(`/organizations/${orgId}/members`, {
    email,
    role,
  });
  return res.data;
}
