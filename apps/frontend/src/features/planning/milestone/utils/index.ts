import type { MilestoneStatus } from "../types";

export function milestoneStatusLabel(status: MilestoneStatus): string {
  const labels: Record<MilestoneStatus, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    skipped: "Skipped",
  };
  return labels[status];
}

export function milestoneStatusColor(status: MilestoneStatus): string {
  const colors: Record<MilestoneStatus, string> = {
    pending: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    skipped: "bg-yellow-100 text-yellow-700",
  };
  return colors[status];
}
