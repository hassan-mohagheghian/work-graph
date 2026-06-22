"use client";

import { useState } from "react";
import { useCreateTask } from "../hooks/use-create-task";
import { useOrg } from "@/shared/context/org-context";
import { useProjects } from "@/features/project/hooks/use-projects";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function CreateTaskDialog() {
  const { orgId } = useOrg();
  const mutation = useCreateTask(orgId);

  const { data: projects = [] } = useProjects(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");

  function handleCreate() {
    if (!orgId || !projectId || !title.trim()) return;

    mutation.mutate({
      org_id: orgId,
      project_id: projectId,
      title,
    });

    setTitle("");
    setProjectId("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* TITLE */}
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* PROJECT SELECT */}
          <select
            className="w-full border rounded p-2"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select project</option>

            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* ACTIONS */}
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
