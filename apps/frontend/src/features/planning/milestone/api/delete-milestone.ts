import { api } from "@/shared/lib/api";

export async function deleteMilestone(orgId: string, milestoneId: string) {
  const res = await api.delete(`/milestones/${milestoneId}?org_id=${orgId}`);
  return res.data;
}
