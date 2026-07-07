import { api } from "@/shared/lib/api";

export async function getMilestone(orgId: string, milestoneId: string) {
  const res = await api.get(`/milestones/${milestoneId}`, {
    params: { org_id: orgId },
  });
  return res.data;
}
