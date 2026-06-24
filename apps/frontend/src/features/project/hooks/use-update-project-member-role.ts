import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectMemberRole } from "../api/update-project-member-role";

export function useUpdateProjectMemberRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateProjectMemberRole(projectId, userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}
