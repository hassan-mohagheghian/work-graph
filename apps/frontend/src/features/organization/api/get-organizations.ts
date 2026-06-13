import api from "@/lib/api/client";

export type Organization = {
  id: string;
  name: string;
};

export async function getOrganizations(): Promise<Organization[]> {
  const res = await api.get("/org");

  return res.data;
}
