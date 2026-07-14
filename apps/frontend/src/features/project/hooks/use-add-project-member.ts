import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addProjectMember,
  AddProjectMemberRequest,
} from "../api/add-project-member";

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProjectMemberRequest) =>
      addProjectMember(projectId, payload),
    meta: { successMessage: "Member added to project" },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-members", projectId],
      });
    },
  });
}
