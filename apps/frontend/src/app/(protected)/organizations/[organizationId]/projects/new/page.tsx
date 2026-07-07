"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject } from "@/features/project/api/create-projects";
import { ROUTES } from "@/shared/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export default function NewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const orgId = params.organizationId as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createProject(orgId, { name, description: description || undefined }),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
      router.push(ROUTES.PROJECT_DETAIL(orgId, data.id));
    },
  });

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Create New Project</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
