"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { useMe } from "@/features/auth/hooks/use-me";

export default function LoginPage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full flex justify-center px-4">
        {!!user && <p>You logged in</p>}
        {!user && <LoginForm />}
      </div>
    </main>
  );
}
