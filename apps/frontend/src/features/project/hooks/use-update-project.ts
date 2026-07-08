import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../api/update-project";

export function useUpdateProject(orgId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: { name?: string; description?: string };
    }) => updateProject(orgId!, projectId, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", orgId] });
    },
  });
}
