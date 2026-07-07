import { api } from "@/shared/lib/api";

export async function getTasksByProject(orgId: string, projectId: string) {
  const res = await api.get("/tasks", {
    params: { org_id: orgId, project_id: projectId },
  });

  return res.data.items;
}
