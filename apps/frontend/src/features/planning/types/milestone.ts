export type MilestoneStatus = "pending" | "in_progress" | "completed" | "skipped";

export interface Milestone {
  id: string;
  roadmap_id: string;
  org_id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  order: number;
  created_at: string;
  updated_at: string;
}
