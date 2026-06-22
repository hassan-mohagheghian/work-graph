import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api/get-tasks";

export function useTasks(orgId?: string | null) {
  return useQuery({
    queryKey: ["tasks", orgId],
    queryFn: () => getTasks(orgId),
    enabled: !!orgId,
  });
}
