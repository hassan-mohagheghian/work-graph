"use client";

import Link from "next/link";

import { Button } from "@/shared/ui/button";

type AuthButtonProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

export function AuthButton({ isAuthenticated, onLogout }: AuthButtonProps) {
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
    );
  }

  return (
    <Button variant="outline" onClick={onLogout}>
      Logout
    </Button>
  );
}
