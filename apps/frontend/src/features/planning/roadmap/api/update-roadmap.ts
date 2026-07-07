import { api } from "@/shared/lib/api";

export async function updateRoadmap(
  orgId: string,
  roadmapId: string,
  data: { title?: string; description?: string; status?: string },
) {
  const res = await api.patch(`/roadmaps/${roadmapId}?org_id=${orgId}`, data);
  return res.data;
}
