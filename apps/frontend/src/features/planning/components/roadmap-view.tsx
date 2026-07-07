"use client";

import { useState } from "react";
import { useOrg } from "@/shared/context/org-context";
import { useRoadmaps } from "../roadmap/hooks/use-roadmaps";
import { useMilestones } from "../milestone/hooks/use-milestones";
import { useReorderMilestones } from "../milestone/hooks/use-reorder-milestones";
import { useDeleteRoadmap } from "../roadmap/hooks/use-delete-roadmap";
import { useActivateRoadmap } from "../roadmap/hooks/use-activate-roadmap";

import { CreateRoadmapDialog } from "../roadmap/components/create-roadmap-dialog";
import { EditRoadmapDialog } from "../roadmap/components/edit-roadmap-dialog";
import { CreateMilestoneDialog } from "../milestone/components/create-milestone-dialog";
import { MilestoneSection } from "../milestone/components/milestone-section";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Trash2, Zap, Plus } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  archived: "Archived",
};

export function RoadmapView({ projectId }: { projectId: string }) {
  const { orgId } = useOrg();
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);

  const { data: roadmaps = [], isLoading: loadingRoadmaps } = useRoadmaps(
    orgId,
    projectId
  );

  // Auto-select active or first roadmap
  const effectiveSelectedId =
    selectedRoadmapId ??
    roadmaps.find((r: any) => r.status === "active")?.id ??
    roadmaps[0]?.id;

  const { data: milestones = [], isLoading: loadingMilestones } = useMilestones(
    orgId,
    effectiveSelectedId
  );

  const reorderMilestones = useReorderMilestones(orgId);
  const deleteRoadmap = useDeleteRoadmap(orgId);
  const activateRoadmap = useActivateRoadmap(orgId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedRoadmap = roadmaps.find((r: any) => r.id === effectiveSelectedId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && effectiveSelectedId) {
      const oldIndex = milestones.findIndex((m: any) => m.id === active.id);
      const newIndex = milestones.findIndex((m: any) => m.id === over.id);

      const reordered = arrayMove(milestones, oldIndex, newIndex);
      const orderedIds = reordered.map((m: any) => m.id);

      reorderMilestones.mutate({
        roadmapId: effectiveSelectedId,
        orderedIds,
      });
    }
  }

  if (loadingRoadmaps) return <p>Loading roadmaps...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Roadmap</h2>
        <CreateRoadmapDialog />
      </div>

      {/* Empty state */}
      {roadmaps.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No roadmaps yet. Create one to start planning your project.
            </p>
            <CreateRoadmapDialog />
          </CardContent>
        </Card>
      )}

      {/* Roadmaps sidebar + milestones detail */}
      {roadmaps.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Roadmap list sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Roadmaps ({roadmaps.length})
            </h3>
            <div className="space-y-2">
              {roadmaps.map((roadmap: any) => {
                const isSelected = roadmap.id === effectiveSelectedId;
                return (
                  <button
                    key={roadmap.id}
                    onClick={() => setSelectedRoadmapId(roadmap.id)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {roadmap.title}
                          </span>
                          {roadmap.status === "active" && (
                            <Zap className="size-3.5 text-blue-500 shrink-0" />
                          )}
                        </div>
                        {roadmap.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {roadmap.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] shrink-0 ${STATUS_COLORS[roadmap.status]}`}
                      >
                        {STATUS_LABELS[roadmap.status]}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-2">
                      {roadmap.status === "draft" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            activateRoadmap.mutate(roadmap.id);
                          }}
                        >
                          <Zap className="size-3 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoadmap.mutate(roadmap.id);
                        }}
                      >
                        <Trash2 className="size-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestones detail panel */}
          <div className="space-y-4">
            {selectedRoadmap ? (
              <>
                {/* Roadmap header with edit */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">
                        {selectedRoadmap.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[selectedRoadmap.status]}
                      >
                        {STATUS_LABELS[selectedRoadmap.status]}
                      </Badge>
                    </div>
                    {selectedRoadmap.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedRoadmap.description}
                      </p>
                    )}
                  </div>
                  <EditRoadmapDialog roadmap={selectedRoadmap} />
                </div>

                <Separator />

                {/* Milestones section */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Milestones ({milestones.length})
                  </h4>
                  <CreateMilestoneDialog roadmapId={effectiveSelectedId!} />
                </div>

                {loadingMilestones ? (
                  <p className="text-muted-foreground text-sm">
                    Loading milestones...
                  </p>
                ) : milestones.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-3">
                        No milestones yet. Add milestones to organize your
                        roadmap.
                      </p>
                      <CreateMilestoneDialog roadmapId={effectiveSelectedId!} />
                    </CardContent>
                  </Card>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={milestones.map((m: any) => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {milestones.map((milestone: any) => (
                          <MilestoneSection
                            key={milestone.id}
                            milestone={milestone}
                            orgId={orgId!}
                            projectId={projectId}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Select a roadmap to view its milestones
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
