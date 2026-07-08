"use client";

import { useEffect, useState } from "react";
import { useUpdateMilestone } from "../hooks/use-update-milestone";
import { useDeleteMilestone } from "../hooks/use-delete-milestone";
import { useOrg } from "@/shared/context/org-context";

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
import type { Milestone } from "../types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

interface EditMilestoneSheetProps {
  milestone: Milestone;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMilestoneSheet({
  milestone,
  open,
  onOpenChange,
}: EditMilestoneSheetProps) {
  const { orgId } = useOrg();
  const updateMilestone = useUpdateMilestone(orgId);
  const deleteMilestone = useDeleteMilestone(orgId);

  const [title, setTitle] = useState(milestone.title);
  const [description, setDescription] = useState(milestone.description || "");
  const [status, setStatus] = useState(milestone.status);

  useEffect(() => {
    if (open) {
      setTitle(milestone.title);
      setDescription(milestone.description || "");
      setStatus(milestone.status);
    }
  }, [open, milestone]);

  function handleUpdate() {
    if (!orgId || !title.trim()) return;

    updateMilestone.mutate(
      {
        milestoneId: milestone.id,
        data: {
          title,
          description: description || undefined,
          status,
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
    deleteMilestone.mutate(milestone.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Edit Milestone</SheetTitle>
          <SheetDescription>Update milestone details and status.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="milestone-title">Title</Label>
            <Input
              id="milestone-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="milestone-description">Description</Label>
            <textarea
              id="milestone-description"
              className="w-full border rounded-md p-2 text-sm min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMilestone.isPending}
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
            <Button size="sm" onClick={handleUpdate} disabled={updateMilestone.isPending}>
              {updateMilestone.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
