"use client";

import { useState } from "react";
import { useCreateRoadmap } from "../hooks/use-create-roadmap";
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

export function CreateRoadmapDialog() {
  const { orgId } = useOrg();
  const mutation = useCreateRoadmap(orgId);
  const { data: projects = [] } = useProjects(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");

  function handleCreate() {
    if (!orgId || !projectId || !title.trim()) return;

    mutation.mutate({
      org_id: orgId,
      project_id: projectId,
      title,
      description: description || undefined,
    });

    setTitle("");
    setDescription("");
    setProjectId("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Roadmap</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Roadmap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Roadmap title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

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
