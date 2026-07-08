"use client";

import { useState } from "react";
import { useOrg } from "@/shared/context/org-context";
import { useRoadmaps } from "../roadmap/hooks/use-roadmaps";
import { useDeleteRoadmap } from "../roadmap/hooks/use-delete-roadmap";
import { useActivateRoadmap } from "../roadmap/hooks/use-activate-roadmap";
import { useMilestones } from "../milestone/hooks/use-milestones";
import { useDeleteMilestone } from "../milestone/hooks/use-delete-milestone";
import { useUpdateMilestone } from "../milestone/hooks/use-update-milestone";

import { CreateRoadmapSheet } from "../roadmap/components/create-roadmap-dialog";
import { RoadmapCard } from "../roadmap/components/roadmap-card";
import { CreateMilestoneSheet } from "../milestone/components/create-milestone-dialog";
import { MilestoneCard } from "../milestone/components/milestone-card";

import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

export function PlanningView({ projectId }: { projectId?: string }) {
  const { orgId } = useOrg();
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [createRoadmapOpen, setCreateRoadmapOpen] = useState(false);
  const [createMilestoneOpen, setCreateMilestoneOpen] = useState(false);

  const { data: roadmaps = [], isLoading: loadingRoadmaps } = useRoadmaps(
    orgId,
    projectId,
  );
  const { data: milestones = [], isLoading: loadingMilestones } = useMilestones(
    orgId,
    selectedRoadmapId ?? undefined,
  );

  const deleteRoadmap = useDeleteRoadmap(orgId);
  const activateRoadmap = useActivateRoadmap(orgId);
  const deleteMilestone = useDeleteMilestone(orgId);
  const updateMilestone = useUpdateMilestone(orgId);

  const selectedRoadmap = roadmaps.find((r: any) => r.id === selectedRoadmapId);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Planning</h2>
        <Button size="sm" onClick={() => setCreateRoadmapOpen(true)}>
          <Plus className="size-4 mr-1" />
          Create Roadmap
        </Button>
      </div>

      {/* ROADMAPS LIST */}
      {!selectedRoadmapId && (
        <div className="space-y-3">
          {loadingRoadmaps && <p className="text-muted-foreground">Loading...</p>}

          {roadmaps.map((roadmap: any) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onOpen={setSelectedRoadmapId}
              onDelete={(id) => deleteRoadmap.mutate(id)}
              onActivate={(id) => activateRoadmap.mutate(id)}
            />
          ))}

          {!loadingRoadmaps && roadmaps.length === 0 && (
            <p className="text-muted-foreground">No roadmaps yet.</p>
          )}
        </div>
      )}

      {/* SELECTED ROADMAP DETAIL */}
      {selectedRoadmapId && selectedRoadmap && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setSelectedRoadmapId(null)}>
              Back
            </Button>
            <h3 className="text-lg font-semibold">{selectedRoadmap.title}</h3>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={() => setCreateMilestoneOpen(true)}>
              <Plus className="size-4 mr-1" />
              Add Milestone
            </Button>
          </div>

          <div className="space-y-3">
            {loadingMilestones && (
              <p className="text-muted-foreground">Loading milestones...</p>
            )}

            {milestones.map((milestone: any) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                onDelete={(id) => deleteMilestone.mutate(id)}
                onStatusChange={(id, status) =>
                  updateMilestone.mutate({ milestoneId: id, data: { status } })
                }
              />
            ))}

            {!loadingMilestones && milestones.length === 0 && (
              <p className="text-muted-foreground">No milestones yet.</p>
            )}
          </div>
        </div>
      )}

      <CreateRoadmapSheet
        projectId={projectId ?? ""}
        open={createRoadmapOpen}
        onOpenChange={setCreateRoadmapOpen}
      />

      {selectedRoadmapId && (
        <CreateMilestoneSheet
          roadmapId={selectedRoadmapId}
          open={createMilestoneOpen}
          onOpenChange={setCreateMilestoneOpen}
        />
      )}
    </div>
  );
}
