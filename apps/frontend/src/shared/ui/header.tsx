"use client";

import Link from "next/link";
import { AuthButton } from "./auth_button";

export function Header() {
  return (
    <header className="w-full border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold">
        WorkGraph
      </Link>
      <AuthButton />
    </header>
  );
}
