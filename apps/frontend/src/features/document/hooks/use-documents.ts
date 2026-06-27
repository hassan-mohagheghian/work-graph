import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "../api/document.api";
import type { LinkTargetType } from "../types/document";

export function useDocuments(
  orgId?: string | null,
  filters?: { target_type?: LinkTargetType; target_id?: string },
) {
  return useQuery({
    queryKey: ["documents", orgId, filters?.target_type, filters?.target_id],
    queryFn: () => getDocuments(orgId!, filters),
    enabled: !!orgId,
  });
}
