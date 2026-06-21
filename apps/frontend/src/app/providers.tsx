"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";

import { OrgProvider } from "@/shared/context/org-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OrgProvider>{children}</OrgProvider>
    </QueryClientProvider>
  );
}
