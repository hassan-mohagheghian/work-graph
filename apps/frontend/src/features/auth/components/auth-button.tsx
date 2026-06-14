"use client";

import Link from "next/link";

import { Button } from "@/shared/ui/button";

import { useAuthStatus } from "../hooks/use-auth-status";
import { useLogout } from "../hooks/use-logout";

export function AuthButton() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const { logout } = useLogout();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
    );
  }

  return (
    <Button variant="outline" onClick={logout}>
      Logout
    </Button>
  );
}
