"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getOrganizations } from "@/features/organization/api/get-organizations";
import type { Organization } from "@/features/organization/api/get-organizations";
import { CreateOrganization } from "@/features/organization/components/create-organization";
import { EditOrganizationSheet } from "@/features/organization/components/edit-organization-sheet";
import { setActiveOrg } from "@/features/organization/model/active-org";
import { useOrg } from "@/shared/context/org-context";
import {
  PageBody,
  PageHeader,
  PageLoading,
  PageShell,
} from "@/shared/layout/page-layout";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

export default function OrganizationsPage() {
  const router = useRouter();
  const { setOrgId } = useOrg();

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  function handleSelect(orgId: string) {
    setActiveOrg(orgId);
    setOrgId(orgId);
    router.push(`/organizations/${orgId}`);
  }

  function handleEdit(org: Organization, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingOrg(org);
    setEditOpen(true);
  }

  return (
    <PageShell>
      <PageBody>
        <PageHeader
          title="Organizations"
          actions={<CreateOrganization />}
        />

        {isLoading ? (
          <PageLoading />
        ) : orgs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No organizations yet</p>
        ) : (
          <div className="space-y-2">
            {orgs.map((org) => (
              <div
                key={org.id}
                onClick={() => handleSelect(org.id)}
                className="flex cursor-pointer items-center justify-between rounded-md border p-3 transition hover:bg-muted/50"
              >
                <span className="font-medium">{org.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleEdit(org, e)}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </PageBody>

      <EditOrganizationSheet
        organization={editingOrg}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </PageShell>
  );
}
