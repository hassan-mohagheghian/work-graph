import { api } from "@/shared/lib/api";

export async function getMilestones(orgId: string, roadmapId: string) {
  const res = await api.get(`/milestones/roadmap/${roadmapId}`, {
    params: { org_id: orgId },
  });
  return res.data.items;
}
