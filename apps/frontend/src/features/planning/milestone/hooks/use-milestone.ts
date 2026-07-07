import { useQuery } from "@tanstack/react-query";
import { getMilestone } from "../api/get-milestone";

export function useMilestone(orgId?: string | null, milestoneId?: string) {
  return useQuery({
    queryKey: ["milestone", orgId, milestoneId],
    queryFn: () => getMilestone(orgId!, milestoneId!),
    enabled: !!orgId && !!milestoneId,
  });
}
