import { api } from "@/shared/lib/api";

export async function getProjectMembers(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/members`);

  return data;
}
