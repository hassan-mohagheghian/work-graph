import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoadmap } from "../api/update-roadmap";

export function useUpdateRoadmap(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, data }: { roadmapId: string; data: any }) =>
      updateRoadmap(orgId!, roadmapId, data),
    meta: { successMessage: "Roadmap updated" },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roadmaps", orgId] });
    },
  });
}
