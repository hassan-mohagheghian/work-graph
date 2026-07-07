import { useQuery } from "@tanstack/react-query";
import { getRoadmaps } from "../api/get-roadmaps";

export function useRoadmaps(orgId?: string | null, projectId?: string) {
  return useQuery({
    queryKey: ["roadmaps", orgId, projectId],
    queryFn: () => getRoadmaps(orgId!, projectId),
    enabled: !!orgId,
  });
}
