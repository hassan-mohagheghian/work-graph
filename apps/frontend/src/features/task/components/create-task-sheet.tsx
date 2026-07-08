"use client";

import { useEffect, useState } from "react";
import { useCreateTask } from "../hooks/use-create-task";
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

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

interface CreateTaskSheetProps {
  projectId: string;
  defaultStatus?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskSheet({
  projectId,
  defaultStatus = "todo",
  open,
  onOpenChange,
}: CreateTaskSheetProps) {
  const { orgId } = useOrg();
  const mutation = useCreateTask(orgId);

  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const [roadmapId, setRoadmapId] = useState("");
  const { data: milestones = [] } = useMilestones(
    orgId,
    roadmapId || undefined
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [milestoneId, setMilestoneId] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setRoadmapId("");
      setMilestoneId("");
    }
  }, [open, defaultStatus]);

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate(
      {
        org_id: orgId,
        project_id: projectId,
        title,
        description: description || undefined,
        milestone_id: milestoneId || undefined,
        status,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75vh]">
        <SheetHeader>
          <SheetTitle>Create Task</SheetTitle>
          <SheetDescription>
            Add a new task to your project.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <textarea
              id="task-description"
              className="w-full border rounded-md p-2 text-sm min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
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

        <SheetFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
