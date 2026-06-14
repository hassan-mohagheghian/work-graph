"use client";

import { setActiveOrg } from "@/features/organization/model/active-org";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.id as string;

  useEffect(() => {
    setActiveOrg(orgId);
  }, [orgId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Organization: {orgId}</h1>
    </div>
  );
}
