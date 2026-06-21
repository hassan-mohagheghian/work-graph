import { api } from "@/shared/lib/api";

export async function createProject(orgId: string, data: any) {
  const res = await api.post(`/orgs/${orgId}/projects`, data);
  return res.data;
}
