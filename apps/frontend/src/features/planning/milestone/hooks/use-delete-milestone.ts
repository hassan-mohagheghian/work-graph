import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMilestone } from "../api/delete-milestone";

export function useDeleteMilestone(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => deleteMilestone(orgId!, milestoneId),
    meta: { successMessage: "Milestone deleted" },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", orgId] });
    },
  });
}
