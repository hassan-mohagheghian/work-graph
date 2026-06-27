import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "../api/document.api";

export function useDeleteDocument(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(orgId!, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", orgId] });
    },
  });
}
