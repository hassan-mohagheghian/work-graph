"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageBody, SectionHeader } from "@/shared/layout/page-layout";

export default function ProjectSettingsPage() {
  return (
    <PageBody>
      <SectionHeader title="Project Settings" />

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Project settings coming soon.
          </p>
        </CardContent>
      </Card>
    </PageBody>
  );
}
