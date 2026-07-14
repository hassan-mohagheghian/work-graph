"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/features/organization/api/get-organizations";
import {
  PageBody,
  PageLoading,
  SectionHeader,
} from "@/shared/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { data: org, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId,
  });

  if (isLoading) return <PageLoading />;

  return (
    <PageBody>
      <SectionHeader title="Settings" />

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
    </PageBody>
  );
}
