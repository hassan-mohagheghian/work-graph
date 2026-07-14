import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoadmap } from "../api/delete-roadmap";

export function useDeleteRoadmap(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (roadmapId: string) => deleteRoadmap(orgId!, roadmapId),
    meta: { successMessage: "Roadmap deleted" },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roadmaps", orgId] });
    },
  });
}
