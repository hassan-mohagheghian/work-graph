"use client";

import { useState } from "react";
import { useCreateTask } from "../hooks/use-create-task";
import { useOrg } from "@/shared/context/org-context";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";

export function AddTaskToMilestoneDialog({
  projectId,
  milestoneId,
}: {
  projectId: string;
  milestoneId: string;
}) {
  const { orgId } = useOrg();
  const mutation = useCreateTask(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate(
      {
        org_id: orgId,
        project_id: projectId,
        title,
        description: description || undefined,
        milestone_id: milestoneId,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 text-xs">
          <Plus className="size-3 mr-1" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task to Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && title.trim()) {
                  handleCreate();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Input
              id="task-description"
              placeholder="Brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!title.trim() || mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
