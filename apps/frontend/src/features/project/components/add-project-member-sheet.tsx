"use client";

import { useEffect, useState } from "react";

import { useAddProjectMember } from "@/features/project/hooks/use-add-project-member";

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

interface AddProjectMemberSheetProps {
  orgId: string;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectMemberSheet({
  orgId,
  projectId,
  open,
  onOpenChange,
}: AddProjectMemberSheetProps) {
  const addMember = useAddProjectMember(projectId);

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) {
      setEmail("");
    }
  }, [open]);

  function handleAdd() {
    if (!email.trim()) return;
    addMember.mutate(
      { org_id: orgId, email },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Add Project Member</SheetTitle>
          <SheetDescription>
            Add an organization member to this project.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!email.trim() || addMember.isPending}
          >
            {addMember.isPending ? "Adding..." : "Add Member"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
