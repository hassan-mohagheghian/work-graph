import { TaskApi } from "@/features/task/api/task";
import { Task } from "@/features/task/types/task";
import { useEffect, useState } from "react";

export default function TaskDetailPage({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    TaskApi.get(taskId).then(setTask);
  }, [taskId]);

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
    </div>
  );
}
