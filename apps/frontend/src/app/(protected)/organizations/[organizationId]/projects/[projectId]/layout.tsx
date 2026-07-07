"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/features/project/api/get-projects";
import { ROUTES } from "@/shared/routes";
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

// Ordered by workflow: add docs → AI assesses → roadmap (with milestones) → tasks
const TABS = [
  { label: "Overview", value: "overview", segment: "" },
  { label: "Documents", value: "documents", segment: "documents" },
  { label: "Roadmap", value: "roadmap", segment: "roadmap" },
  { label: "Tasks", value: "tasks", segment: "tasks" },
  { label: "Members", value: "members", segment: "members" },
  { label: "Settings", value: "settings", segment: "settings" },
] as const;

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { data: projects = [] } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => getProjects(orgId),
    enabled: !!orgId,
  });

  const project = projects.find((p: any) => p.id === projectId);
  const projectName = project?.name ?? "Project";

  const projectBase = `/organizations/${orgId}/projects/${projectId}`;
  const currentPath = pathname.replace(projectBase, "").replace(/^\//, "");
  const activeTab = TABS.find((t) => t.segment === currentPath)?.value ?? "overview";

  function handleTabChange(value: string) {
    const tab = TABS.find((t) => t.value === value);
    if (tab) {
      router.push(`${projectBase}${tab.segment ? `/${tab.segment}` : ""}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="px-6 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.ORG_PROJECTS(orgId)}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{projectName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="px-6">
        <h1 className="text-2xl font-bold">{projectName}</h1>
      </div>

      <Separator />

      <div className="px-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList variant="line">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}
