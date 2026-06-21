import { api } from "@/shared/lib/api";
import { Task } from "../types/task";

export const TaskApi = {
  async list(): Promise<Task[]> {
    const res = await api.get("/tasks", {
        headers: {}
    });
    return res.data;
  },

  async get(taskId: string): Promise<Task> {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  },

  async update(taskId: string, payload: Partial<Task>): Promise<Task> {
    const res = await api.patch(`/tasks/${taskId}`, payload);
    return res.data;
  },

  async delete(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};
