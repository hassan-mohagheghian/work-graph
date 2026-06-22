import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/update-task";

export function useUpdateTask(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: any) => updateTask(orgId, taskId, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", orgId] });
    },
  });
}
