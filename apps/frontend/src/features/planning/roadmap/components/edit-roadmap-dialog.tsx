"use client";

import { useEffect, useState } from "react";
import { useUpdateRoadmap } from "../hooks/use-update-roadmap";
import { useDeleteRoadmap } from "../hooks/use-delete-roadmap";
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
import type { Roadmap } from "../types";

interface EditRoadmapSheetProps {
  roadmap: Roadmap;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoadmapSheet({
  roadmap,
  open,
  onOpenChange,
}: EditRoadmapSheetProps) {
  const { orgId } = useOrg();
  const mutation = useUpdateRoadmap(orgId);
  const deleteRoadmap = useDeleteRoadmap(orgId);

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

    mutation.mutate(
      {
        roadmapId: roadmap.id,
        data: {
          title,
          description: description || undefined,
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
    deleteRoadmap.mutate(roadmap.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Edit Roadmap</SheetTitle>
          <SheetDescription>Update the roadmap details.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roadmap-title">Title</Label>
            <Input
              id="roadmap-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roadmap-description">Description</Label>
            <textarea
              id="roadmap-description"
              className="w-full border rounded-md p-2 text-sm min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>
        </div>

        <SheetFooter className="flex-row justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteRoadmap.isPending}
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
            <Button size="sm" onClick={handleUpdate} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
