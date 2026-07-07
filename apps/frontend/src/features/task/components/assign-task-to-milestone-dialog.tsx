"use client";

import { useState } from "react";
import { useTasksByProject } from "../hooks/use-tasks-by-project";
import { useUpdateTask } from "../hooks/use-update-task";
import { useOrg } from "@/shared/context/org-context";

import { Button } from "@/shared/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Link2 } from "lucide-react";

export function AssignTaskToMilestoneDialog({
  projectId,
  milestoneId,
  milestoneName,
}: {
  projectId: string;
  milestoneId: string;
  milestoneName: string;
}) {
  const { orgId } = useOrg();
  const { data: tasks = [] } = useTasksByProject(orgId, projectId);
  const updateTask = useUpdateTask(orgId);

  const [open, setOpen] = useState(false);

  // Show only unassigned tasks or tasks in other milestones
  const availableTasks = tasks.filter(
    (task: any) => !task.milestone_id || task.milestone_id !== milestoneId
  );

  function handleAssign(taskId: string) {
    updateTask.mutate(
      {
        taskId,
        data: { milestone_id: milestoneId },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 text-xs">
          <Link2 className="size-3 mr-1" />
          Assign Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task to {milestoneName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No available tasks to assign
            </p>
          ) : (
            availableTasks.map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {task.milestone_id && (
                    <p className="text-xs text-muted-foreground">
                      Currently in another milestone
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 ml-2"
                  onClick={() => handleAssign(task.id)}
                >
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
