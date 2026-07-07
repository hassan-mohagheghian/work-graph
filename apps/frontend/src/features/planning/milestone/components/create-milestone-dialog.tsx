"use client";

import { useState } from "react";
import { useCreateMilestone } from "../hooks/use-create-milestone";
import { useOrg } from "@/shared/context/org-context";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function CreateMilestoneDialog({ roadmapId }: { roadmapId: string }) {
  const { orgId } = useOrg();
  const mutation = useCreateMilestone(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate({
      org_id: orgId,
      roadmap_id: roadmapId,
      title,
      description: description || undefined,
    });

    setTitle("");
    setDescription("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Milestone</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Milestone title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

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
