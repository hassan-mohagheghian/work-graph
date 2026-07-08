import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttachment } from "../api/document.api";

export function useDeleteAttachment(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      attachmentId,
    }: {
      documentId: string;
      attachmentId: string;
    }) => deleteAttachment(orgId!, documentId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", orgId] });
    },
  });
}
