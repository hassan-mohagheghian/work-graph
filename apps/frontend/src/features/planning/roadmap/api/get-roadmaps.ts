import { api } from "@/shared/lib/api";

export async function getRoadmaps(orgId: string, projectId?: string) {
  const params: Record<string, string> = { org_id: orgId };
  if (projectId) params.project_id = projectId;

  const res = await api.get("/roadmaps", { params });
  return res.data.items;
}
