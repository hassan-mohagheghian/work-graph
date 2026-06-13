import { api } from "@/lib/api/client";

export type Organization = {
  id: string;
  name: string;
};

export async function getOrganizations(): Promise<Organization[]> {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/org", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
