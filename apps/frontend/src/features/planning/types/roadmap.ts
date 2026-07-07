export type RoadmapStatus = "draft" | "active" | "completed" | "archived";

export interface Roadmap {
  id: string;
  project_id: string;
  org_id: string;
  title: string;
  description?: string;
  status: RoadmapStatus;
  created_at: string;
  updated_at: string;
}
