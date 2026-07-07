import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMilestone } from "../api/delete-milestone";

export function useDeleteMilestone(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => deleteMilestone(orgId!, milestoneId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", orgId] });
    },
  });
}
