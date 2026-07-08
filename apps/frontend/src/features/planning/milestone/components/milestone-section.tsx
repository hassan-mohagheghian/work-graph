"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronRight, Pencil, CheckSquare } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { MilestoneTaskList } from "./milestone-list";
import type { Milestone } from "../types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  skipped: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  skipped: "Skipped",
};

export function MilestoneSection({
  milestone,
  orgId,
  projectId,
  onEdit,
  taskCount,
}: {
  milestone: Milestone;
  orgId: string;
  projectId: string;
  onEdit: (milestone: Milestone) => void;
  taskCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-card group"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header row: trigger + edit button as siblings */}
        <div className="flex items-center">
          <CollapsibleTrigger className="flex items-center flex-1 min-w-0 p-3 hover:bg-muted/30 transition rounded-lg">
            {/* Drag handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="size-4 text-muted-foreground" />
            </div>

            {/* Order number */}
            <span className="text-xs text-muted-foreground w-8 text-center shrink-0">
              #{milestone.order + 1}
            </span>

            {/* Expand icon */}
            <div className="shrink-0 mr-2">
              {isOpen ? (
                <ChevronDown className="size-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 text-muted-foreground" />
              )}
            </div>

            {/* Title and badges */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-medium text-sm truncate">{milestone.title}</span>
              <Badge
                variant="secondary"
                className={`text-[10px] shrink-0 ${STATUS_COLORS[milestone.status]}`}
              >
                {STATUS_LABELS[milestone.status]}
              </Badge>
              {taskCount > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                  <CheckSquare className="size-2.5" />
                  {taskCount}
                </span>
              )}
            </div>
          </CollapsibleTrigger>

          {/* Edit button — sibling of CollapsibleTrigger, not nested */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 shrink-0 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit(milestone)}
          >
            <Pencil className="size-3" />
          </Button>
        </div>

        <CollapsibleContent className="px-4 pb-4">
          {milestone.description && (
            <p className="text-sm text-muted-foreground mb-3 ml-10">
              {milestone.description}
            </p>
          )}

          <div className="ml-10">
            <MilestoneTaskList
              orgId={orgId}
              projectId={projectId}
              milestoneId={milestone.id}
              milestoneTitle={milestone.title}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
