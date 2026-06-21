"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/get-projects";

export function useProjects(orgId: string | null) {
  return useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => getProjects(orgId!),
    enabled: !!orgId,
  });
}
