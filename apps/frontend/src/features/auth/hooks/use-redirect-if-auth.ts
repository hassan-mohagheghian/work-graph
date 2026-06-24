"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/shared/routes";
import { getMe } from "../api/get-me";

export function useRedirectIfAuth() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();

        router.replace(ROUTES.HOME);
      } catch {
        // user is not authenticated
      }
    }

    checkAuth();
  }, [router]);
}
