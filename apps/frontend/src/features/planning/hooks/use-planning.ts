import { useRoadmaps } from "../roadmap/hooks/use-roadmaps";

export function usePlanning(orgId?: string | null, projectId?: string) {
  const roadmaps = useRoadmaps(orgId, projectId);

  return {
    roadmaps: roadmaps.data ?? [],
    isLoading: roadmaps.isLoading,
    isError: roadmaps.isError,
  };
}
