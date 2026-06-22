import { api } from "@/shared/lib/api";

export async function deleteTask(orgId: string, taskId: string) {
  const res = await api.delete(`/tasks/${taskId}?org_id=${orgId}`);
  return res.data;
}
