"use client";

import { useEffect, useState } from "react";
import { TaskApi } from "../api/task";
import { Task } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await TaskApi.list();
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { tasks, loading, reload: load };
}
