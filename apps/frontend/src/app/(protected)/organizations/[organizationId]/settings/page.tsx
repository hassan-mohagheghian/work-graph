"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/features/organization/api/get-organizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { data: org, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId,
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Organization Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {org?.name ?? "Organization settings coming soon."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
