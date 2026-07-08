import { useQuery } from "@tanstack/react-query";
import { getDocument } from "../api/document.api";

export function useDocument(orgId?: string | null, documentId?: string) {
  return useQuery({
    queryKey: ["documents", orgId, documentId],
    queryFn: () => getDocument(orgId!, documentId!),
    enabled: !!orgId && !!documentId,
  });
}
