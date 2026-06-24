import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../api/get-project-members";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
}
