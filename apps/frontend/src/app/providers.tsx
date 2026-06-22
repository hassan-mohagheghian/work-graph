"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { OrgProvider } from "@/shared/context/org-context";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OrgProvider>{children}</OrgProvider>
    </QueryClientProvider>
  );
}
