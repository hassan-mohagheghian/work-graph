"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { TaskBoard } from "@/features/task/components/task-board";

import { Card, CardContent } from "@/shared/ui/card";

export default function ProjectTasksPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: tasks = [], isLoading } = useTasksByProject(orgId, projectId);

  if (isLoading) return <p>Loading tasks...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag tasks between columns or click + to create
        </p>
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No tasks yet. Click + in any column to create one.
          </CardContent>
        </Card>
      )}

      {tasks.length > 0 && (
        <TaskBoard tasks={tasks} projectId={projectId} />
      )}
    </div>
  );
}
