"use client";

import { useState } from "react";
import { useOrg } from "@/shared/context/org-context";
import { useTasksByProject } from "@/features/task/hooks/use-tasks-by-project";
import { useRoadmaps } from "../roadmap/hooks/use-roadmaps";
import { useMilestones } from "../milestone/hooks/use-milestones";
import { useReorderMilestones } from "../milestone/hooks/use-reorder-milestones";
import { useDeleteRoadmap } from "../roadmap/hooks/use-delete-roadmap";
import { useActivateRoadmap } from "../roadmap/hooks/use-activate-roadmap";

import { CreateRoadmapSheet } from "../roadmap/components/create-roadmap-dialog";
import { EditRoadmapSheet } from "../roadmap/components/edit-roadmap-dialog";
import { CreateMilestoneSheet } from "../milestone/components/create-milestone-dialog";
import { EditMilestoneSheet } from "../milestone/components/edit-milestone-dialog";
import { MilestoneSection } from "../milestone/components/milestone-section";
import { SectionHeader } from "@/shared/layout/page-layout";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Zap,
  Pencil,
  Plus,
} from "lucide-react";

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
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(
    null
  );

  // Sheet states
  const [createRoadmapOpen, setCreateRoadmapOpen] = useState(false);
  const [editRoadmap, setEditRoadmap] = useState<any>(null);
  const [editRoadmapOpen, setEditRoadmapOpen] = useState(false);
  const [createMilestoneOpen, setCreateMilestoneOpen] = useState(false);
  const [createMilestoneRoadmapId, setCreateMilestoneRoadmapId] = useState("");
  const [editMilestone, setEditMilestone] = useState<any>(null);
  const [editMilestoneOpen, setEditMilestoneOpen] = useState(false);

  const { data: roadmaps = [], isLoading: loadingRoadmaps } = useRoadmaps(
    orgId,
    projectId
  );

  const effectiveExpandedId =
    expandedRoadmapId ??
    roadmaps.find((r: any) => r.status === "active")?.id ??
    roadmaps[0]?.id;

  const { data: milestones = [], isLoading: loadingMilestones } = useMilestones(
    orgId,
    effectiveExpandedId
  );

  const { data: tasks = [] } = useTasksByProject(orgId, projectId);

  const reorderMilestones = useReorderMilestones(orgId);
  const deleteRoadmap = useDeleteRoadmap(orgId);
  const activateRoadmap = useActivateRoadmap(orgId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const expandedRoadmap = roadmaps.find(
    (r: any) => r.id === effectiveExpandedId
  );

  function handleToggle(roadmapId: string) {
    setExpandedRoadmapId((prev) => (prev === roadmapId ? null : roadmapId));
  }

  function handleEditRoadmap(roadmap: any) {
    setEditRoadmap(roadmap);
    setEditRoadmapOpen(true);
  }

  function handleAddMilestone(roadmapId: string) {
    setCreateMilestoneRoadmapId(roadmapId);
    setCreateMilestoneOpen(true);
  }

  function handleEditMilestone(milestone: any) {
    setEditMilestone(milestone);
    setEditMilestoneOpen(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && effectiveExpandedId) {
      const oldIndex = milestones.findIndex((m: any) => m.id === active.id);
      const newIndex = milestones.findIndex((m: any) => m.id === over.id);

      const reordered = arrayMove(milestones, oldIndex, newIndex);
      const orderedIds = reordered.map((m: any) => m.id);

      reorderMilestones.mutate({
        roadmapId: effectiveExpandedId,
        orderedIds,
      });
    }
  }

  if (loadingRoadmaps) return <p>Loading roadmaps...</p>;

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Roadmaps"
        actions={
          <Button size="sm" onClick={() => setCreateRoadmapOpen(true)}>
            <Plus className="size-4 mr-1" />
            Create Roadmap
          </Button>
        }
      />

      {roadmaps.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No roadmaps yet. Create one to start planning your project.
            </p>
            <Button onClick={() => setCreateRoadmapOpen(true)}>
              <Plus className="size-4 mr-1" />
              Create Roadmap
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {roadmaps.map((roadmap: any) => {
          const isExpanded = roadmap.id === effectiveExpandedId;

          return (
            <Card
              key={roadmap.id}
              className={`transition ${
                isExpanded ? "ring-2 ring-primary/20" : ""
              }`}
            >
              {/* Roadmap header — div, not button, to avoid nesting */}
              <div
                className="flex items-center gap-2.5 p-3 cursor-pointer hover:bg-muted/30 transition rounded-lg"
                onClick={() => handleToggle(roadmap.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle(roadmap.id);
                  }
                }}
              >
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">
                      {roadmap.title}
                    </span>
                    {roadmap.status === "active" && (
                      <Zap className="size-3 text-blue-500 shrink-0" />
                    )}
                    <Badge
                      variant="secondary"
                      className={`text-[10px] shrink-0 ${STATUS_COLORS[roadmap.status]}`}
                    >
                      {STATUS_LABELS[roadmap.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {roadmap.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick actions — separate div, not nested buttons */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleEditRoadmap(roadmap)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  {roadmap.status === "draft" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => activateRoadmap.mutate(roadmap.id)}
                    >
                      <Zap className="size-3 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={() => deleteRoadmap.mutate(roadmap.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Expanded milestones */}
              {isExpanded && (
                <div className="px-3 pb-3">
                  <Separator className="mb-3" />

                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-muted-foreground">
                      Milestones ({milestones.length})
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleAddMilestone(roadmap.id)}
                    >
                      <Plus className="size-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  {loadingMilestones ? (
                    <p className="text-xs text-muted-foreground py-2">
                      Loading milestones...
                    </p>
                  ) : milestones.length === 0 ? (
                    <div className="text-center py-4 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">
                        No milestones yet
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => handleAddMilestone(roadmap.id)}
                      >
                        <Plus className="size-3 mr-1" />
                        Add Milestone
                      </Button>
                    </div>
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
                          {milestones.map((milestone: any) => {
                            const milestoneTasks = tasks.filter(
                              (t: any) => t.milestone_id === milestone.id
                            );
                            return (
                              <MilestoneSection
                                key={milestone.id}
                                milestone={milestone}
                                orgId={orgId!}
                                projectId={projectId}
                                onEdit={handleEditMilestone}
                                taskCount={milestoneTasks.length}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Sheets */}
      <CreateRoadmapSheet
        projectId={projectId}
        open={createRoadmapOpen}
        onOpenChange={setCreateRoadmapOpen}
      />

      {editRoadmap && (
        <EditRoadmapSheet
          roadmap={editRoadmap}
          open={editRoadmapOpen}
          onOpenChange={setEditRoadmapOpen}
        />
      )}

      {createMilestoneRoadmapId && (
        <CreateMilestoneSheet
          roadmapId={createMilestoneRoadmapId}
          open={createMilestoneOpen}
          onOpenChange={setCreateMilestoneOpen}
        />
      )}

      {editMilestone && (
        <EditMilestoneSheet
          milestone={editMilestone}
          open={editMilestoneOpen}
          onOpenChange={setEditMilestoneOpen}
        />
      )}
    </div>
  );
}
