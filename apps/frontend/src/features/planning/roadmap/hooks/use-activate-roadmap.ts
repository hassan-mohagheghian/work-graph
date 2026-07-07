import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateRoadmap } from "../api/activate-roadmap";

export function useActivateRoadmap(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (roadmapId: string) => activateRoadmap(orgId!, roadmapId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roadmaps", orgId] });
    },
  });
}
