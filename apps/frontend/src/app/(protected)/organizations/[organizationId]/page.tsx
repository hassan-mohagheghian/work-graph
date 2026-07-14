"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/features/organization/api/get-organizations";
import { EditOrganizationSheet } from "@/features/organization/components/edit-organization-sheet";
import { ROUTES } from "@/shared/routes";
import { PageBody, PageLoading, SectionHeader } from "@/shared/layout/page-layout";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Pencil } from "lucide-react";

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { data: org, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId,
  });

  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <PageLoading />;

  return (
    <>
      <PageBody>
        <SectionHeader
          title="Overview"
          actions={
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="size-3.5 mr-1" />
              Edit
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Link href={ROUTES.ORG_PROJECTS(orgId)}>
            <Card className="cursor-pointer transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage projects
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={ROUTES.ORG_MEMBERS(orgId)}>
            <Card className="cursor-pointer transition hover:shadow-md">
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage organization members
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </PageBody>

      <EditOrganizationSheet
        organization={org}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
