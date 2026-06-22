import { Header } from "@/shared/ui/header";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="pt-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
