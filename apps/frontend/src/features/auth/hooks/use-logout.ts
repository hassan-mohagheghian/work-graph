"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { logout as logoutApi } from "../api/logout";

import { ROUTES } from "@/shared/routes";
import { useActiveOrg } from "@/features/organization/hooks/use-active-org";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { clearOrg } = useActiveOrg();

  async function logout() {
    await logoutApi();

    clearOrg();

    queryClient.removeQueries({
      queryKey: ["me"],
    });

    router.push(ROUTES.LOGIN);
    router.refresh();
  }

  return {
    logout,
  };
}
