import { useQuery } from "@tanstack/react-query";
import { getRoadmap } from "../api/get-roadmap";

export function useRoadmap(orgId?: string | null, roadmapId?: string) {
  return useQuery({
    queryKey: ["roadmap", orgId, roadmapId],
    queryFn: () => getRoadmap(orgId!, roadmapId!),
    enabled: !!orgId && !!roadmapId,
  });
}
