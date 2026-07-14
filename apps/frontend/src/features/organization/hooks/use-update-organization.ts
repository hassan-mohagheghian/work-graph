import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrganization } from "../api/update-organization";

export function useUpdateOrganization(orgId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string }) => updateOrganization(orgId, data),
    meta: { successMessage: "Organization updated" },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["organizations"] });
      qc.invalidateQueries({ queryKey: ["organization", orgId] });
    },
  });
}
