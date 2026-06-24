import { api } from "@/shared/lib/api";

export type AddProjectMemberRequest = {
  org_id: string;
  email: string;
};

export async function addProjectMember(
  projectId: string,
  payload: AddProjectMemberRequest,
) {
  const { data } = await api.post(`/projects/${projectId}/members`, payload);

  return data;
}
