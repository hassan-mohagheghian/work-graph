"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "./token";

export function useAuth() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToken(getToken());
    setMounted(true);
  }, []);

  function logout() {
    clearToken();
    setToken(null);
    router.push("/");
  }

  return {
    token,
    isAuthenticated: !!token,
    logout,
    mounted,
  };
}
