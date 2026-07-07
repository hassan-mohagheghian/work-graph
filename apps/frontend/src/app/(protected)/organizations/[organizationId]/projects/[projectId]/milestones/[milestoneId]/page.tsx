"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useOrg } from "@/shared/context/org-context";
import { useMilestone } from "@/features/planning/milestone/hooks/use-milestone";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { ROUTES } from "@/shared/routes";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  skipped: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

export default function MilestoneDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;
  const milestoneId = params.milestoneId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: milestone, isLoading } = useMilestone(orgId, milestoneId);
  const { data: tasks = [] } = useTasksByProject(orgId, projectId);

  if (isLoading) return <p className="p-6">Loading...</p>;

  if (!milestone) return <p className="p-6">Milestone not found</p>;

  const milestoneTasks = tasks.filter(
    (task: any) => task.milestone_id === milestoneId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{milestone.title}</h1>
            <Badge
              variant="secondary"
              className={`text-xs ${STATUS_COLORS[milestone.status]}`}
            >
              {STATUS_LABELS[milestone.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Order: #{milestone.order + 1}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.PROJECT_ROADMAP(orgId, projectId))}
        >
          Back to Roadmap
        </Button>
      </div>

      <Separator />

      {milestone.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {milestone.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({milestoneTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {milestoneTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks in this milestone
            </p>
          ) : (
            <ul className="space-y-2">
              {milestoneTasks.map((task: any) => (
                <li key={task.id}>
                  <Link
                    href={ROUTES.TASK_DETAIL(orgId, projectId, task.id)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition"
                  >
                    <span
                      className={`size-2 rounded-full ${
                        task.status === "done"
                          ? "bg-green-500"
                          : task.status === "in_progress"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm">{task.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {task.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
