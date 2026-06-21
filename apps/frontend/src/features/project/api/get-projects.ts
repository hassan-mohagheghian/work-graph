import { api } from "@/shared/lib/api";

export async function getProjects(orgId: string) {
  const res = await api.get(`projects/org/${orgId}`);
  return res.data;
}
