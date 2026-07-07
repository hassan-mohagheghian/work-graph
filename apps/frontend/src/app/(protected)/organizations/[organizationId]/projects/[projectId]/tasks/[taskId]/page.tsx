"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useOrg } from "@/shared/context/org-context";
import { useUpdateTask } from "@/features/task/hooks/use-update-task";
import { useDeleteTask } from "@/features/task/hooks/use-delete-task";
import { getTasksByProject } from "@/features/task/api/get-tasks-by-project";
import { useRoadmaps } from "@/features/planning/roadmap/hooks/use-roadmaps";
import { useMilestones } from "@/features/planning/milestone/hooks/use-milestones";
import { ROUTES } from "@/shared/routes";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;
  const taskId = params.taskId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", orgId, projectId],
    queryFn: () => getTasksByProject(orgId, projectId),
    enabled: !!orgId && !!projectId,
  });

  const task = tasks.find((t: any) => t.id === taskId);

  // Get roadmaps and milestones for milestone assignment
  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const activeRoadmap = roadmaps.find((r: any) => r.status === "active") ?? roadmaps[0];
  const { data: milestones = [] } = useMilestones(orgId, activeRoadmap?.id);

  const updateTask = useUpdateTask(orgId);
  const deleteTask = useDeleteTask(orgId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("");
  const [milestoneId, setMilestoneId] = useState<string>("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setMilestoneId(task.milestone_id || "");
    }
  }, [task]);

  if (isLoading) return <p className="p-6">Loading...</p>;

  if (!task) return <p className="p-6">Task not found</p>;

  function handleSave() {
    updateTask.mutate({
      taskId,
      data: {
        title,
        description,
        status,
        milestone_id: milestoneId || null,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Task Details</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => {
              deleteTask.mutate(taskId);
              router.push(ROUTES.PROJECT_TASKS(orgId, projectId));
            }}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full border rounded-md p-2 text-sm min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Milestone</Label>
              <Select value={milestoneId} onValueChange={setMilestoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="No milestone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No milestone</SelectItem>
                  {milestones.map((milestone: any) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={updateTask.isPending}>
              {updateTask.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  status === "done"
                    ? "bg-green-100 text-green-700"
                    : status === "in_progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {status === "done"
                  ? "Done"
                  : status === "in_progress"
                    ? "In Progress"
                    : "To Do"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
