import { api } from "@/lib/api/client";
import { LoginRequest, LoginResponse } from "../types/auth";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post("auth/login", payload);
  return response.data;
}
