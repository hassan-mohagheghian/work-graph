"use client";

import { useState } from "react";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { EditTaskSheet } from "@/features/task/components/edit-task-sheet";
import type { Task } from "@/features/task/types/task";

export function MilestoneTaskList({
  orgId,
  projectId,
  milestoneId,
}: {
  orgId: string;
  projectId: string;
  milestoneId: string;
}) {
  const { data: tasks = [], isLoading } = useTasksByProject(orgId, projectId);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-2">Loading tasks...</p>;
  }

  const milestoneTasks = tasks.filter(
    (task: Task) => (task as any).milestone_id === milestoneId
  );

  if (milestoneTasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No tasks in this milestone
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-1">
        {milestoneTasks.map((task: Task) => (
          <li key={task.id}>
            <button
              onClick={() => {
                setSelectedTask(task);
                setSheetOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition w-full text-left"
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
              <span className="truncate">{task.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {selectedTask && (
        <EditTaskSheet
          task={selectedTask}
          projectId={projectId}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </>
  );
}
