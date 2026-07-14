"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { TaskBoard } from "@/features/task/components/task-board";
import { CreateTaskSheet } from "@/features/task/components/create-task-sheet";
import { PageBody, SectionHeader } from "@/shared/layout/page-layout";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Plus } from "lucide-react";

export default function ProjectTasksPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: tasks = [], isLoading } = useTasksByProject(orgId, projectId);

  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) return <p>Loading tasks...</p>;

  return (
    <PageBody>
      <SectionHeader
        title="Tasks"
        description="Drag tasks between columns or click + to create"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4 mr-1" />
            Create Task
          </Button>
        }
      />

      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No tasks yet. Create one to get started.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4 mr-1" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      )}

      {tasks.length > 0 && (
        <TaskBoard tasks={tasks} projectId={projectId} />
      )}

      <CreateTaskSheet
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </PageBody>
  );
}
