import { useRoadmap } from "../roadmap/hooks/use-roadmap";
import { useMilestones } from "../milestone/hooks/use-milestones";

export function useRoadmapWithMilestones(orgId?: string | null, roadmapId?: string) {
  const roadmap = useRoadmap(orgId, roadmapId);
  const milestones = useMilestones(orgId, roadmapId);

  return {
    roadmap: roadmap.data,
    milestones: milestones.data ?? [],
    isLoading: roadmap.isLoading || milestones.isLoading,
    isError: roadmap.isError || milestones.isError,
  };
}
