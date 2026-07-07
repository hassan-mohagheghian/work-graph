"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { RoadmapView } from "@/features/planning/components/roadmap-view";

export default function RoadmapPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  return <RoadmapView projectId={projectId} />;
}
