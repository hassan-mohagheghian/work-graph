import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoadmap } from "../api/create-roadmap";

export function useCreateRoadmap(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoadmap,
    meta: { successMessage: "Roadmap created" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmaps", orgId] });
    },
  });
}
