"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { useUpdateTask } from "@/features/task/hooks/use-update-task";
import { useDeleteTask } from "@/features/task/hooks/use-delete-task";
import { CreateTaskDialog } from "@/features/task/components/create-task-dialog";
import { ROUTES } from "@/shared/routes";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function ProjectTasksPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: tasks = [], isLoading } = useTasksByProject(orgId, projectId);
  const updateTask = useUpdateTask(orgId);
  const deleteTask = useDeleteTask(orgId);

  if (isLoading) return <p>Loading tasks...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage project tasks
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No tasks yet. Create one to get started.
          </CardContent>
        </Card>
      )}

      {tasks.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task: any) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link
                      href={ROUTES.TASK_DETAIL(orgId, projectId, task.id)}
                      className="hover:underline font-medium"
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${STATUS_COLORS[task.status]}`}
                    >
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTask.mutate(task.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
