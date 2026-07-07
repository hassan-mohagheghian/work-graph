import { api } from "@/shared/lib/api";

export async function createMilestone(data: {
  org_id: string;
  roadmap_id: string;
  title: string;
  description?: string;
  order?: number;
}) {
  const res = await api.post(`/milestones?org_id=${data.org_id}`, data);
  return res.data;
}
