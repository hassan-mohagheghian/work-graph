"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { useRedirectIfAuth } from "@/shared/auth/use-redirect-if_auth";

export default function LoginPage() {
  useRedirectIfAuth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full flex justify-center px-4">
        <LoginForm />
      </div>
    </main>
  );
}
