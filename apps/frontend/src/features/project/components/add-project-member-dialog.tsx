"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

type Props = {
  orgId: string;
  projectId: string;
};

export function AddProjectMemberDialog({ orgId, projectId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Member</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
        </DialogHeader>

        <div>
          TODO:
          <ul className="list-disc pl-4 mt-2">
            <li>Load organization members</li>
            <li>Select member</li>
            <li>Select role</li>
            <li>Create project membership</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
