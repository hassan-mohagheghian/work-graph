import { api } from "@/shared/lib/api";

export async function reorderMilestones(
  orgId: string,
  roadmapId: string,
  orderedIds: string[],
) {
  const res = await api.post(`/milestones/roadmap/${roadmapId}/reorder?org_id=${orgId}`, {
    ordered_ids: orderedIds,
  });
  return res.data.items;
}
