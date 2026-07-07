import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { Roadmap } from "../types";
import { roadmapStatusLabel, roadmapStatusColor } from "../utils";

export function RoadmapCard({
  roadmap,
  onDelete,
  onOpen,
  onActivate,
}: {
  roadmap: Roadmap;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onActivate?: (id: string) => void;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold" onClick={() => onOpen(roadmap.id)}>
            {roadmap.title}
          </h3>

          <div className="flex gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${roadmapStatusColor(roadmap.status)}`}
            >
              {roadmapStatusLabel(roadmap.status)}
            </span>

            {roadmap.status === "draft" && onActivate && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onActivate(roadmap.id)}
              >
                Activate
              </Button>
            )}

            <Button
              variant="destructive"
              onClick={() => onDelete(roadmap.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {roadmap.description || "No description"}
        </p>
      </CardContent>
    </Card>
  );
}
