import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { Milestone } from "../types";
import { milestoneStatusLabel, milestoneStatusColor } from "../utils";

export function MilestoneCard({
  milestone,
  onDelete,
  onStatusChange,
}: {
  milestone: Milestone;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}) {
  return (
    <Card className="hover:shadow-sm transition">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              #{milestone.order + 1}
            </span>
            <h4 className="font-medium">{milestone.title}</h4>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${milestoneStatusColor(milestone.status)}`}
            >
              {milestoneStatusLabel(milestone.status)}
            </span>

            {onStatusChange && milestone.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(milestone.id, "in_progress")}
              >
                Start
              </Button>
            )}

            {onStatusChange && milestone.status === "in_progress" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(milestone.id, "completed")}
              >
                Complete
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(milestone.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      {milestone.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {milestone.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
