import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/get-me";

export function useAuthStatus() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  return {
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    user: query.data,
  };
}
