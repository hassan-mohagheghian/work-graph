import { api } from "@/shared/lib/api";

export async function deleteRoadmap(orgId: string, roadmapId: string) {
  const res = await api.delete(`/roadmaps/${roadmapId}?org_id=${orgId}`);
  return res.data;
}
