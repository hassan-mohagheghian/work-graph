"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createOrganization } from "../api/create-organization";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export function CreateOrganization() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      setName("");
      setOpen(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err?.message ?? "Something went wrong");
    },
  });

  function handleCreate() {
    if (!name.trim()) return;
    mutation.mutate({ name });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <DialogTrigger asChild>
        <Button>+ Create Organization</Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Organization name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setName("");
                setError("");
              }}
            >
              Reset
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
