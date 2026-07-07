"use client";

import Link from "next/link";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { ROUTES } from "@/shared/routes";
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
    <ul className="space-y-1">
      {milestoneTasks.map((task: Task) => (
        <li key={task.id}>
          <Link
            href={ROUTES.TASK_DETAIL(orgId, projectId, task.id)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition"
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
          </Link>
        </li>
      ))}
    </ul>
  );
}
