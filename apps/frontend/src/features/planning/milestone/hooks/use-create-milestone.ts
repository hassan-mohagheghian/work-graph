import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "../api/create-milestone";

export function useCreateMilestone(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,
    meta: { successMessage: "Milestone created" },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", orgId, variables.roadmap_id],
      });
    },
  });
}
