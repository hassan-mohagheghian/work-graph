"use client";

import { useRouter } from "next/navigation";
import { logout as logoutApi } from "../api/logout";
import { ROUTES } from "@/shared/routes";

export function useLogout() {
  const router = useRouter();

  async function logout() {
    await logoutApi();

    router.push(ROUTES.LOGIN);
    router.refresh();
  }

  return {
    logout,
  };
}
