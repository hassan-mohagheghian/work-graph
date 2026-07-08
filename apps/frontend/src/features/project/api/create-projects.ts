import { api } from "@/shared/lib/api";

export async function createProject(orgId: string, data: any) {
  const res = await api.post(`/projects/org/${orgId}`, data);
  return res.data;
}
