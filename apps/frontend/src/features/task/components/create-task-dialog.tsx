"use client";

import { useState } from "react";
import { useCreateTask } from "../hooks/use-create-task";
import { useOrg } from "@/shared/context/org-context";
import { useRoadmaps } from "@/features/planning/roadmap/hooks/use-roadmaps";
import { useMilestones } from "@/features/planning/milestone/hooks/use-milestones";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

interface CreateTaskDialogProps {
  projectId: string;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const { orgId } = useOrg();
  const mutation = useCreateTask(orgId);

  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const [roadmapId, setRoadmapId] = useState("");
  const { data: milestones = [] } = useMilestones(orgId, roadmapId || undefined);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [milestoneId, setMilestoneId] = useState("");

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate({
      org_id: orgId,
      project_id: projectId,
      title,
      milestone_id: milestoneId || undefined,
    });

    setTitle("");
    setRoadmapId("");
    setMilestoneId("");
    setOpen(false);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setRoadmapId("");
      setMilestoneId("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Create Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* ROADMAP SELECT (optional) */}
          {roadmaps.length > 0 && (
            <select
              className="w-full border rounded p-2"
              value={roadmapId}
              onChange={(e) => {
                setRoadmapId(e.target.value);
                setMilestoneId("");
              }}
            >
              <option value="">No roadmap</option>
              {roadmaps.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          )}

          {/* MILESTONE SELECT (optional, only when roadmap selected) */}
          {roadmapId && milestones.length > 0 && (
            <select
              className="w-full border rounded p-2"
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
            >
              <option value="">No milestone</option>
              {milestones.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleCreate} disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
