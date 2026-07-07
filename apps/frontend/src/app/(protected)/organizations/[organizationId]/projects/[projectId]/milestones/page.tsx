"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { useOrg } from "@/shared/context/org-context";
import { useRoadmaps } from "@/features/planning/roadmap/hooks/use-roadmaps";
import { useMilestones } from "@/features/planning/milestone/hooks/use-milestones";
import { useDeleteMilestone } from "@/features/planning/milestone/hooks/use-delete-milestone";
import { CreateMilestoneDialog } from "@/features/planning/milestone/components/create-milestone-dialog";
import { ROUTES } from "@/shared/routes";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Plus, Trash2 } from "lucide-react";

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

export default function MilestonesPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: roadmaps = [] } = useRoadmaps(orgId, projectId);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("");

  const { data: milestones = [], isLoading } = useMilestones(
    orgId,
    selectedRoadmapId || undefined
  );

  const deleteMilestone = useDeleteMilestone(orgId);

  // Auto-select first active or first roadmap
  useEffect(() => {
    if (roadmaps.length > 0 && !selectedRoadmapId) {
      const active = roadmaps.find((r: any) => r.status === "active");
      setSelectedRoadmapId(active?.id ?? roadmaps[0].id);
    }
  }, [roadmaps, selectedRoadmapId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Milestones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage milestones across your roadmaps
          </p>
        </div>
        {selectedRoadmapId && (
          <CreateMilestoneDialog roadmapId={selectedRoadmapId} />
        )}
      </div>

      {/* Roadmap selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          {roadmaps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No roadmaps yet. Create one in the Roadmap tab first.
            </p>
          ) : (
            <Select
              value={selectedRoadmapId}
              onValueChange={setSelectedRoadmapId}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a roadmap" />
              </SelectTrigger>
              <SelectContent>
                {roadmaps.map((roadmap: any) => (
                  <SelectItem key={roadmap.id} value={roadmap.id}>
                    {roadmap.title} ({roadmap.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Milestones list */}
      {selectedRoadmapId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Milestones ({milestones.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No milestones yet. Add one to start tracking progress.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestones.map((milestone: any, index: number) => (
                    <TableRow key={milestone.id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={ROUTES.MILESTONE_DETAIL(
                            orgId,
                            projectId,
                            milestone.id
                          )}
                          className="hover:underline font-medium"
                        >
                          {milestone.title}
                        </Link>
                        {milestone.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {milestone.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${STATUS_COLORS[milestone.status]}`}
                        >
                          {STATUS_LABELS[milestone.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMilestone.mutate(milestone.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
