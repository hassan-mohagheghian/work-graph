"use client";

import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { PageShell } from "@/shared/layout/page-layout";

export default function HomePage() {
  return (
    <PageShell className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">WorkGraph</h1>

          <p className="max-w-lg text-muted-foreground">
            Manage organizations, projects, members, and tasks from a single
            workspace.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/organizations">Organizations</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
