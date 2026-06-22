import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/delete-task";

export function useDeleteTask(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (taskId: any) => deleteTask(orgId, taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", orgId] });
    },
  });
}
