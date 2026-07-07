import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderMilestones } from "../api/reorder-milestones";

export function useReorderMilestones(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, orderedIds }: { roadmapId: string; orderedIds: string[] }) =>
      reorderMilestones(orgId!, roadmapId, orderedIds),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["milestones", orgId, variables.roadmapId],
      });
    },
  });
}
