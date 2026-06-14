import { api } from "@/shared/lib/api";

export async function logout() {
  await api.post("/auth/logout");
}
