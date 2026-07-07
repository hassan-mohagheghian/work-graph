"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { setActiveOrg } from "@/features/organization/model/active-org";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const orgId = params.organizationId as string;
  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) {
      setActiveOrg(orgId);
      setOrgId(orgId);
    }
  }, [orgId, setOrgId]);

  return <>{children}</>;
}
