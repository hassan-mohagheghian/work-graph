"use client";

import { useState, useEffect } from "react";
import { useUpdateRoadmap } from "../hooks/use-update-roadmap";
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
import { Pencil } from "lucide-react";
import type { Roadmap } from "../types";

export function EditRoadmapDialog({ roadmap }: { roadmap: Roadmap }) {
  const { orgId } = useOrg();
  const mutation = useUpdateRoadmap(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(roadmap.title);
  const [description, setDescription] = useState(roadmap.description || "");

  useEffect(() => {
    if (open) {
      setTitle(roadmap.title);
      setDescription(roadmap.description || "");
    }
  }, [open, roadmap]);

  function handleUpdate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate({
      roadmapId: roadmap.id,
      data: {
        title,
        description: description || undefined,
      },
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Roadmap</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Roadmap title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
