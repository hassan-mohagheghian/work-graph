import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocument } from "../api/document.api";

export function useUpdateDocument(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: { title?: string; description?: string };
    }) => updateDocument(orgId!, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", orgId] });
    },
  });
}
