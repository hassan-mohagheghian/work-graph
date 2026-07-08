export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  project_id: string;
  org_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  milestone_id?: string | null;
  roadmap_title?: string | null;
  milestone_title?: string | null;
  order: number;
  created_at: string;
}
