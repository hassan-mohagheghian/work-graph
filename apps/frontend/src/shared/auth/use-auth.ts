import { useRouter } from "next/navigation";
import { clearToken, getToken } from "./token";
import { useMemo } from "react";

export function useAuth() {
  const router = useRouter();
  const token = getToken();
  const isAuthenticated = useMemo(() => !!token, [token]);

  function logout() {
    clearToken();
    router.push("/");
  }

  return {
    token,
    isAuthenticated,
    logout,
  };
}
