import { api } from "@/shared/lib/api";

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  role: string,
) {
  const { data } = await api.patch(`/projects/${projectId}/members/${userId}`, {
    role,
  });

  return data;
}
