import { api } from "@/shared/lib/api";

export type Organization = {
  id: string;
  name: string;
};

export async function getOrganizations(): Promise<Organization[]> {
  const res = await api.get("/organizations");

  return res.data;
}
