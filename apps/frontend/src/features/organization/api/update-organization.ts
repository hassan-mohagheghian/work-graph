import { api } from "@/shared/lib/api";

import type { Organization } from "./get-organizations";

export async function updateOrganization(
  orgId: string,
  data: { name?: string },
): Promise<Organization> {
  const res = await api.patch(`/organizations/${orgId}`, data);
  return res.data;
}
