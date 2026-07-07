import { api } from "@/shared/lib/api";

export async function activateRoadmap(orgId: string, roadmapId: string) {
  const res = await api.post(`/roadmaps/${roadmapId}/activate?org_id=${orgId}`);
  return res.data;
}
