import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "../api/document.api";

export function useCreateDocument(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    meta: { successMessage: "Document created" },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", orgId] });
    },
  });
}
