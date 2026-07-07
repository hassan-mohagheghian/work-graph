"use client";

import { useState } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

import { ROUTES } from "@/shared/routes";
import { Badge } from "@/shared/ui/badge";
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
}: {
  milestone: Milestone;
  orgId: string;
  projectId: string;
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
      className="border rounded-lg bg-card"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-3 hover:bg-muted/30 transition rounded-lg">
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

          {/* Title and status */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-medium truncate">{milestone.title}</span>
            <Badge
              variant="secondary"
              className={`text-[10px] shrink-0 ${STATUS_COLORS[milestone.status]}`}
            >
              {STATUS_LABELS[milestone.status]}
            </Badge>
          </div>

          {/* View link */}
          <Link
            href={ROUTES.MILESTONE_DETAIL(orgId, projectId, milestone.id)}
            className="shrink-0 ml-2 p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-4 text-muted-foreground" />
          </Link>
        </CollapsibleTrigger>

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
