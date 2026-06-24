import { useQuery } from "@tanstack/react-query";

import { getOrganizations } from "../api/get-organizations";

export function useOrganizations(enabled = true) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
    enabled,
  });
}
