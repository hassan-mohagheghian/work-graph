import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderTasks } from "../api/reorder-tasks";

export function useReorderTasks(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      orderedIds,
    }: {
      projectId: string;
      orderedIds: string[];
    }) => reorderTasks(orgId!, projectId, orderedIds),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", orgId] });
    },
  });
}
