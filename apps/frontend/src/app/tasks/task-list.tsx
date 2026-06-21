"use client";

import { TaskApi } from "@/features/task/api/task";
import { TaskCard } from "@/features/task/components/task-card";
import { useTasks } from "@/features/task/hooks/useTasks";

export default function TaskListClient() {
  const { tasks, loading, reload } = useTasks();

  async function handleDelete(id: string) {
    await TaskApi.delete(id);
    await reload();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
