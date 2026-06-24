import { api } from "@/shared/lib/api";

export async function removeProjectMember(projectId: string, userId: string) {
  await api.delete(`/projects/${projectId}/members/${userId}`);
}
