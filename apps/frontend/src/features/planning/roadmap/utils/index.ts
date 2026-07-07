import type { RoadmapStatus } from "../types";

export function roadmapStatusLabel(status: RoadmapStatus): string {
  const labels: Record<RoadmapStatus, string> = {
    draft: "Draft",
    active: "Active",
    completed: "Completed",
    archived: "Archived",
  };
  return labels[status];
}

export function roadmapStatusColor(status: RoadmapStatus): string {
  const colors: Record<RoadmapStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    archived: "bg-orange-100 text-orange-700",
  };
  return colors[status];
}
