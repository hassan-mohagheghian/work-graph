export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  project_id: string;
  org_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
}
