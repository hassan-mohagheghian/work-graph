"use client";

import { useState } from "react";
import { useCreateDocument } from "../hooks/use-create-document";
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

interface CreateDocumentDialogProps {
  projectId?: string;
}

export function CreateDocumentDialog({ projectId }: CreateDocumentDialogProps) {
  const { orgId } = useOrg();
  const mutation = useCreateDocument(orgId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate() {
    if (!orgId || !title.trim()) return;

    const links = projectId
      ? [{ target_type: "project" as const, target_id: projectId }]
      : [];

    if (links.length === 0) return;

    mutation.mutate({
      org_id: orgId,
      title,
      description: description || undefined,
      links,
    });

    setTitle("");
    setDescription("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Document</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-md p-2 text-sm min-h-[100px]"
            placeholder="Description (requirements, notes, goals...)"
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
