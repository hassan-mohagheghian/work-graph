import { api } from "@/shared/lib/api";

export async function getRoadmap(orgId: string, roadmapId: string) {
  const res = await api.get(`/roadmaps/${roadmapId}`, {
    params: { org_id: orgId },
  });
  return res.data;
}
