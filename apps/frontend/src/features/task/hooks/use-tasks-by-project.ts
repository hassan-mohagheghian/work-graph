import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "../api/get-tasks-by-project";

export function useTasksByProject(orgId?: string | null, projectId?: string) {
  return useQuery({
    queryKey: ["tasks", orgId, projectId],
    queryFn: () => getTasksByProject(orgId!, projectId!),
    enabled: !!orgId && !!projectId,
  });
}
