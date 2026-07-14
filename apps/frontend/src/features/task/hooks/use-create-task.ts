import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/create-task";

export function useCreateTask(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    meta: { successMessage: "Task created" },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId],
      });
    },
  });
}
