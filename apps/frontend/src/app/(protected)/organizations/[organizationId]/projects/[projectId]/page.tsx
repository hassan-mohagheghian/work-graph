"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/project/api/get-projects";
import { useRoadmaps } from "@/features/planning/roadmap/hooks/use-roadmaps";
import { useMilestones } from "@/features/planning/milestone/hooks/use-milestones";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { useProjectMembers } from "@/features/project/hooks/use-project-members";
import { EditProjectSheet } from "@/features/project/components/edit-project-sheet";
import { ROUTES } from "@/shared/routes";
import { SectionHeader } from "@/shared/layout/page-layout";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Pencil, Map, Target, CheckSquare, Users } from "lucide-react";

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
  const [editOpen, setEditOpen] = useState(false);

  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const { data: tasks = [] } = useTasksByProject(orgId, projectId);
  const { data: members = [] } = useProjectMembers(projectId);

  // Get milestones count from first roadmap (or 0)
  const activeRoadmap = roadmaps.find((r: any) => r.status === "active") ?? roadmaps[0];
  const { data: milestones = [] } = useMilestones(
    orgId,
    activeRoadmap?.id
  );

  if (isLoading) return <p>Loading...</p>;

  if (!project) return <p>Project not found</p>;

  const stats = [
    {
      label: "Roadmaps",
      value: roadmaps.length,
      icon: Map,
      href: ROUTES.PROJECT_ROADMAP(orgId, projectId),
    },
    {
      label: "Milestones",
      value: milestones.length,
      icon: Target,
      href: ROUTES.PROJECT_ROADMAP(orgId, projectId),
    },
    {
      label: "Tasks",
      value: tasks.length,
      icon: CheckSquare,
      href: ROUTES.PROJECT_TASKS(orgId, projectId),
    },
    {
      label: "Members",
      value: members.length,
      icon: Users,
      href: ROUTES.PROJECT_MEMBERS(orgId, projectId),
    },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Overview"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5 mr-1" />
            Edit Project
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition cursor-pointer">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-muted">
                    <stat.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Details */}
      <div className="grid gap-2.5 md:grid-cols-2">
        <Card>
          <CardContent className="p-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-0.5">
              Description
            </h3>
            <p className="text-sm">
              {project.description || "No description"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <h3 className="text-xs font-medium text-muted-foreground mb-0.5">
              Created
            </h3>
            <p className="text-sm">
              {new Date(project.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <EditProjectSheet
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
