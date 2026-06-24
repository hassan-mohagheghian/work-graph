"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useMe } from "@/features/auth/hooks/use-me";
import { ROUTES } from "@/shared/routes";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading } = useMe();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
