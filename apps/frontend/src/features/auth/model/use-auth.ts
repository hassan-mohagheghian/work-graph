"use client";

import { useRouter } from "next/navigation";
import { login } from "../api/login";
import { logout } from "../api/logout";

export function useAuth() {
  const router = useRouter();

  async function signIn(username: string, password: string) {
    await login({ username, password });
    router.push("/organizations");
  }

  async function signOut() {
    await logout();
    router.push("/login");
  }

  return {
    signIn,
    signOut,
  };
}
