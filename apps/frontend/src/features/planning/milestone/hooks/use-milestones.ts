import { useQuery } from "@tanstack/react-query";
import { getMilestones } from "../api/get-milestones";

export function useMilestones(orgId?: string | null, roadmapId?: string) {
  return useQuery({
    queryKey: ["milestones", orgId, roadmapId],
    queryFn: () => getMilestones(orgId!, roadmapId!),
    enabled: !!orgId && !!roadmapId,
  });
}
