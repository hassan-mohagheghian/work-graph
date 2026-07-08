"use client";

import { useEffect, useState } from "react";
import { useCreateMilestone } from "../hooks/use-create-milestone";
import { useOrg } from "@/shared/context/org-context";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/ui/sheet";

interface CreateMilestoneSheetProps {
  roadmapId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMilestoneSheet({
  roadmapId,
  open,
  onOpenChange,
}: CreateMilestoneSheetProps) {
  const { orgId } = useOrg();
  const mutation = useCreateMilestone(orgId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    mutation.mutate(
      {
        org_id: orgId,
        roadmap_id: roadmapId,
        title,
        description: description || undefined,
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
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Add Milestone</SheetTitle>
          <SheetDescription>Add a milestone to this roadmap.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone-title">Title</Label>
            <Input
              id="milestone-title"
              placeholder="Milestone title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-description">Description</Label>
            <textarea
              id="milestone-description"
              className="w-full border rounded-md p-2 text-sm min-h-[60px]"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
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
