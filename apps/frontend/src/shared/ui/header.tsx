"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/routes";

export function Header() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("access_token");
    router.push(ROUTES.LOGIN);
  }

  return (
    <header className="w-full border-b px-4 py-3 flex items-center justify-between">
      <div className="font-semibold">WorkGraph</div>

      <button
        onClick={logout}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </header>
  );
}
