"use client";

import { useEffect, useState } from "react";
import { useUpdateTask } from "../hooks/use-update-task";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useOrg } from "@/shared/context/org-context";
import { useRoadmaps } from "@/features/planning/roadmap/hooks/use-roadmaps";
import { useMilestones } from "@/features/planning/milestone/hooks/use-milestones";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/ui/sheet";

interface EditTaskSheetProps {
  task: any;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskSheet({
  task,
  projectId,
  open,
  onOpenChange,
}: EditTaskSheetProps) {
  const { orgId } = useOrg();
  const updateTask = useUpdateTask(orgId);
  const deleteTask = useDeleteTask(orgId);

  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const [roadmapId, setRoadmapId] = useState("");
  const { data: milestones = [] } = useMilestones(
    orgId,
    roadmapId || undefined
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [milestoneId, setMilestoneId] = useState("");

  useEffect(() => {
    if (task && open) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setMilestoneId(task.milestone_id || "");
      setRoadmapId("");
    }
  }, [task, open]);

  function handleSave() {
    if (!title.trim()) return;

    updateTask.mutate(
      {
        taskId: task.id,
        data: {
          title,
          description,
          status,
          milestone_id: milestoneId || null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  function handleDelete() {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to the task. Save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <textarea
              id="task-description"
              className="w-full border rounded-md p-2 text-sm min-h-[80px]"
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

          {roadmaps.length > 0 && (
            <div className="space-y-2">
              <Label>Roadmap</Label>
              <Select
                value={roadmapId}
                onValueChange={(v) => {
                  setRoadmapId(v);
                  setMilestoneId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No roadmap" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No roadmap</SelectItem>
                  {roadmaps.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {roadmapId && roadmapId !== "none" && milestones.length > 0 && (
            <div className="space-y-2">
              <Label>Milestone</Label>
              <Select value={milestoneId} onValueChange={setMilestoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="No milestone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No milestone</SelectItem>
                  {milestones.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateTask.isPending}>
              {updateTask.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
