"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/project/api/get-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export default function ProjectOverviewPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => getProjects(orgId),
    enabled: !!orgId,
  });

  const project = projects.find((p: any) => p.id === projectId);

  if (isLoading) return <p>Loading...</p>;

  if (!project) return <p>Project not found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Overview</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {project.status ?? "active"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
