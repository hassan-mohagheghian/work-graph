"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function ProjectSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Project Settings</h2>

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
    </div>
  );
}
