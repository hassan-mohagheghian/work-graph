import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAttachment } from "../api/document.api";

export function useUploadAttachment(orgId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      file,
    }: {
      documentId: string;
      file: File;
    }) => uploadAttachment(orgId!, documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", orgId] });
    },
  });
}
