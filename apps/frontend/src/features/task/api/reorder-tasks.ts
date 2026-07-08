import { api } from "@/shared/lib/api";

export async function reorderTasks(
  orgId: string,
  projectId: string,
  orderedIds: string[]
) {
  const res = await api.post(`/tasks/reorder?org_id=${orgId}`, {
    project_id: projectId,
    ordered_ids: orderedIds,
  });
  return res.data;
}
