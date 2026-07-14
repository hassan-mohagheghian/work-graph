"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

import { OrgProvider } from "@/shared/context/org-context";
import { getErrorMessage } from "@/shared/lib/errors";
import { notify } from "@/shared/lib/notify";
import { Toaster } from "@/shared/ui/sonner";

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.silentError) return;
        notify.error(getErrorMessage(error));
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silentError) return;
        notify.error(getErrorMessage(error));
      },
      onSuccess: (_data, _variables, _context, mutation) => {
        const message = mutation.meta?.successMessage;
        if (message) {
          notify.success(message);
        }
      },
    }),
    defaultOptions: {
      queries: {
        meta: { silentError: true },
      },
    },
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <OrgProvider>
        {children}
        <Toaster />
      </OrgProvider>
    </QueryClientProvider>
  );
}
