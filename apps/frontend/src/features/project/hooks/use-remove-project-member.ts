import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProjectMember } from "../api/remove-project-member";

export function useRemoveProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeProjectMember(projectId, userId),
    meta: { successMessage: "Member removed from project" },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}
