"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/features/organization/api/get-organizations";
import { ROUTES } from "@/shared/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function OrganizationPage() {
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
      <h1 className="text-xl font-bold">{org?.name ?? "Organization"}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={ROUTES.ORG_PROJECTS(orgId)}>
          <Card className="hover:shadow-md transition cursor-pointer">
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
          <Card className="hover:shadow-md transition cursor-pointer">
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
    </div>
  );
}
