"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/routes";

export function useRedirectIfAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.replace(ROUTES.ORGANIZATIONS);
    }
  }, [router]);
}
