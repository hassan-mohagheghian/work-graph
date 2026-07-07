import { api } from "@/shared/lib/api";

export async function createRoadmap(data: {
  org_id: string;
  project_id: string;
  title: string;
  description?: string;
}) {
  const res = await api.post(`/roadmaps?org_id=${data.org_id}`, data);
  return res.data;
}
