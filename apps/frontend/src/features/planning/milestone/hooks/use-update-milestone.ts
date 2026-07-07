import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestone } from "../api/update-milestone";

export function useUpdateMilestone(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ milestoneId, data }: { milestoneId: string; data: any }) =>
      updateMilestone(orgId!, milestoneId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["milestones", orgId] });
    },
  });
}
