import { api } from "@/shared/lib/api";

export type CreateOrganizationRequest = {
  name: string;
};

export type Organization = {
  id: string;
  name: string;
};

export async function createOrganization(
  data: CreateOrganizationRequest,
): Promise<Organization> {
  const res = await api.post("/organizations", data);
  return res.data;
}
