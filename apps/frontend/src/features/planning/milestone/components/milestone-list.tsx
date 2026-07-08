"use client";

import { useState } from "react";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { useUpdateTask } from "@/features/task/hooks/use-update-task";
import { AddTaskToMilestoneDialog } from "@/features/task/components/add-task-to-milestone-dialog";
import { AssignTaskToMilestoneDialog } from "@/features/task/components/assign-task-to-milestone-dialog";
import { EditTaskSheet } from "@/features/task/components/edit-task-sheet";
import type { Task } from "@/features/task/types/task";
import { CheckCircle2, Circle, Clock, X } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function MilestoneTaskList({
  orgId,
  projectId,
  milestoneId,
  milestoneTitle,
}: {
  orgId: string;
  projectId: string;
  milestoneId: string;
  milestoneTitle: string;
}) {
  const { data: tasks = [], isLoading } = useTasksByProject(orgId, projectId);
  const updateTask = useUpdateTask(orgId);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground py-2">Loading tasks...</p>
    );
  }

  const milestoneTasks = tasks.filter(
    (task: Task) => task.milestone_id === milestoneId
  );

  function handleRemoveFromMilestone(taskId: string) {
    updateTask.mutate({
      taskId,
      data: { milestone_id: null },
    });
  }

  return (
    <div className="space-y-2">
      {milestoneTasks.length > 0 && (
        <ul className="space-y-1">
          {milestoneTasks.map((task: Task) => {
            const StatusIcon =
              task.status === "done"
                ? CheckCircle2
                : task.status === "in_progress"
                  ? Clock
                  : Circle;

            const statusColor =
              task.status === "done"
                ? "text-green-500"
                : task.status === "in_progress"
                  ? "text-yellow-500"
                  : "text-muted-foreground";

            return (
              <li key={task.id} className="flex items-center group">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setSheetOpen(true);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition flex-1 min-w-0 text-left"
                >
                  <StatusIcon className={`size-4 shrink-0 ${statusColor}`} />
                  <span className="truncate">{task.title}</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromMilestone(task.id)}
                  title="Remove from milestone"
                >
                  <X className="size-3 text-muted-foreground" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      {milestoneTasks.length === 0 && (
        <p className="text-sm text-muted-foreground py-1">
          No tasks in this milestone
        </p>
      )}

      <div className="flex items-center gap-1 pt-1">
        <AddTaskToMilestoneDialog
          projectId={projectId}
          milestoneId={milestoneId}
        />
        <AssignTaskToMilestoneDialog
          projectId={projectId}
          milestoneId={milestoneId}
          milestoneName={milestoneTitle}
        />
      </div>

      {selectedTask && (
        <EditTaskSheet
          task={selectedTask}
          projectId={projectId}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </div>
  );
}
