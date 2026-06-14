"use client";

import { QueryProvider } from "./providers";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/shared/routes";
import { Header } from "@/shared/ui/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === ROUTES.LOGIN;

  return (
    <html lang="en">
      <body>
        {!isAuthPage && <Header />}

        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
