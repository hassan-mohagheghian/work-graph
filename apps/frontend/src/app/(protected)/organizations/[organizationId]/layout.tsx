"use client";

import { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "@/features/organization/api/get-organizations";
import { useOrg } from "@/shared/context/org-context";
import { setActiveOrg } from "@/features/organization/model/active-org";
import { ROUTES } from "@/shared/routes";
import { PageShell } from "@/shared/layout/page-layout";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Separator } from "@/shared/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

const TABS = [
  { label: "Overview", value: "overview", segment: "" },
  { label: "Projects", value: "projects", segment: "projects" },
  { label: "Members", value: "members", segment: "members" },
  { label: "Settings", value: "settings", segment: "settings" },
] as const;

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const orgId = params.organizationId as string;
  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) {
      setActiveOrg(orgId);
      setOrgId(orgId);
    }
  }, [orgId, setOrgId]);

  const { data: org, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
    enabled: !!orgId,
  });

  const orgName = org?.name ?? "Organization";
  const orgBase = `/organizations/${orgId}`;
  const currentPath = pathname.replace(orgBase, "").replace(/^\//, "");
  const activeTab = TABS.find((t) => t.segment === currentPath)?.value ?? "overview";

  function handleTabChange(value: string) {
    const tab = TABS.find((t) => t.value === value);
    if (tab) {
      router.push(`${orgBase}${tab.segment ? `/${tab.segment}` : ""}`);
    }
  }

  return (
    <PageShell>
      <div className="space-y-4 pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.ORGANIZATIONS}>
                Organizations
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{orgName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold tracking-tight">{orgName}</h1>

        <Separator />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {children}
      </div>
    </PageShell>
  );
}
