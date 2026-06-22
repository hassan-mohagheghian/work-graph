"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useTasks } from "@/features/task/hooks/use-tasks";

import { useUpdateTask } from "@/features/task/hooks/use-update-task";
import { useDeleteTask } from "@/features/task/hooks/use-delete-task";

import { CreateTaskDialog } from "@/features/task/components/create-task-dialog";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function TasksPage() {
  const params = useParams();
  const orgId = params.id as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: tasks = [], isLoading } = useTasks(orgId);

  const updateTask = useUpdateTask(orgId);
  const deleteTask = useDeleteTask(orgId);

  // local edit state (important for inline editing)
  const [edit, setEdit] = useState<Record<string, any>>({});

  if (isLoading) return <p>Loading tasks...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <CreateTaskDialog />
      </div>

      {/* EMPTY */}
      {tasks.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No tasks found
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      <div className="grid gap-3">
        {tasks.map((task: any) => {
          const local = edit[task.id] ?? task;

          function patchTask(patch: any) {
            const updated = { ...local, ...patch };

            setEdit((prev) => ({
              ...prev,
              [task.id]: updated,
            }));

            updateTask.mutate({
              taskId: task.id,
              data: patch,
            });
          }

          return (
            <Card key={task.id}>
              <CardContent className="p-4 space-y-3">
                {/* TITLE (INLINE EDIT) */}
                <Input
                  value={local.title}
                  onChange={(e) => patchTask({ title: e.target.value })}
                />

                {/* DESCRIPTION (INLINE EDIT) */}
                <Input
                  value={local.description || ""}
                  placeholder="Description"
                  onChange={(e) => patchTask({ description: e.target.value })}
                />

                {/* STATUS */}
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={local.status}
                  onChange={(e) => patchTask({ status: e.target.value })}
                >
                  <option value="todo">todo</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>

                {/* DELETE ONLY */}
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
