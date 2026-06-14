import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">WorkGraph</h1>

      <p>Organization and team management platform</p>

      <div className="flex gap-4">
        <Link href="/login">Login</Link>

        <Link href="/organizations">Organizations</Link>
      </div>
    </main>
  );
}
