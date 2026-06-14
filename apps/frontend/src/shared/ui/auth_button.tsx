"use client";

import Link from "next/link";
import { Button } from "./button";
import { useAuth } from "../auth/use-auth";

export function AuthButton() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="px-4 py-2 border rounded">
        Login
      </Link>
    );
  }

  return (
    <Button onClick={logout} className="px-4 py-2 border rounded">
      Logout
    </Button>
  );
}
