import { api } from "@/shared/lib/api";

export async function getTasks(orgId?: string | null) {
  const res = await api.get("/tasks", {
    params: { org_id: orgId },
  });

  return res.data.items;
}
