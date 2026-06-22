import { api } from "@/shared/lib/api";

export async function updateTask(orgId: string, taskId: string, data: any) {
  const res = await api.patch(`/tasks/${taskId}?org_id=${orgId}`, data);
  return res.data;
}
