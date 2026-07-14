"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { useMe } from "@/features/auth/hooks/use-me";

export default function LoginPage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      {!!user && <p>You logged in</p>}
      {!user && <LoginForm />}
    </div>
  );
}
