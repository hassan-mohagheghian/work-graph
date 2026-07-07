import { api } from "@/shared/lib/api";

export async function updateMilestone(
  orgId: string,
  milestoneId: string,
  data: { title?: string; description?: string; status?: string; order?: number },
) {
  const res = await api.patch(`/milestones/${milestoneId}?org_id=${orgId}`, data);
  return res.data;
}
