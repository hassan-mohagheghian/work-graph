"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/shared/ui/button";
import { setActiveOrg } from "@/features/organization/model/active-org";

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.id as string;

  useEffect(() => {
    setActiveOrg(orgId);
  }, [orgId]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Organization: {orgId}</h1>

      {/* Navigation */}
      <div className="flex gap-3">
        <Link href={`/organizations/${orgId}/members`}>
          <Button variant="outline">Members</Button>
        </Link>
      </div>
    </div>
  );
}
