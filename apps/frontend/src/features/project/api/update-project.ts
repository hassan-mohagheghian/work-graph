import { api } from "@/shared/lib/api";

export async function updateProject(
  orgId: string,
  projectId: string,
  data: { name?: string; description?: string }
) {
  const res = await api.patch(`/projects/${projectId}?org_id=${orgId}`, data);
  return res.data;
}
