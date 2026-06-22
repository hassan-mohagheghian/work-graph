import { api } from "@/shared/lib/api";

export async function createTask(data: {
  org_id: string;
  project_id: string;
  title: string;
  description?: string;
}) {
  const res = await api.post(`/tasks?org_id=${data.org_id}`, data);
  return res.data;
}
