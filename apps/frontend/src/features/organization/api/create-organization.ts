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
  try {
    const res = await api.post("/organizations", data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error?.message || "Something wen wrong";
    throw new Error(message);
  }
}
