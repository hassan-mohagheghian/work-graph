"use client";

import { useEffect, useState } from "react";
import { getMe } from "../api/get-me";

export function useAuthStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        console.log("auth status");
        await getMe();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    check();
  }, []);

  return {
    isAuthenticated,
    isLoading,
  };
}
