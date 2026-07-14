"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

import { AuthButton } from "@/features/auth/components/auth-button";
import { useMe } from "@/features/auth/hooks/use-me";

import { useActiveOrg } from "@/features/organization/hooks/use-active-org";
import { useOrganizations } from "@/features/organization/hooks/use-organizations";
import { useProjects } from "@/features/project/hooks/use-projects";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/ui/dropdown-menu";

import { pageShellClass } from "@/shared/layout/page-layout";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ROUTES } from "@/shared/routes";
import {
  FolderOpen,
  FileText,
  Map,
  CheckSquare,
  Users,
  Settings,
  Building2,
  ChevronDown,
  Search,
  ArrowLeft,
} from "lucide-react";

// Ordered by workflow: docs → roadmap (with milestones) → tasks
const ORG_TABS = [
  { label: "Overview", segment: "", icon: FolderOpen },
  { label: "Projects", segment: "projects", icon: FolderOpen },
  { label: "Members", segment: "members", icon: Users },
  { label: "Settings", segment: "settings", icon: Settings },
];

const PROJECT_TABS = [
  { label: "Overview", segment: "", icon: FolderOpen },
  { label: "Documents", segment: "documents", icon: FileText },
  { label: "Roadmap", segment: "roadmap", icon: Map },
  { label: "Tasks", segment: "tasks", icon: CheckSquare },
  { label: "Members", segment: "members", icon: Users },
  { label: "Settings", segment: "settings", icon: Settings },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { activeOrgId, selectOrg, mounted } = useActiveOrg();

  const { data: user, isLoading } = useMe();
  const { logout } = useLogout();

  const isAuthed = !!user;

  const { data: orgs = [] } = useOrganizations(isAuthed);
  const { data: projects = [] } = useProjects(activeOrgId);

  // Dropdown states
  const [orgOpen, setOrgOpen] = useState(false);
  const [orgTabsOpen, setOrgTabsOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectTabsOpen, setProjectTabsOpen] = useState(false);

  // Search states
  const [orgSearch, setOrgSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === activeOrgId),
    [orgs, activeOrgId],
  );

  // Extract projectId from pathname
  const projectId = useMemo(() => {
    if (!activeOrgId) return null;
    const match = pathname.match(
      new RegExp(`/organizations/${activeOrgId}/projects/([^/]+)`)
    );
    return match ? match[1] : null;
  }, [pathname, activeOrgId]);

  const activeProject = useMemo(
    () => projects.find((p: any) => p.id === projectId),
    [projects, projectId],
  );

  // Determine current tabs
  const currentOrgTab = useMemo(() => {
    if (!activeOrgId) return null;
    const orgBase = `/organizations/${activeOrgId}`;
    const currentPath = pathname.replace(orgBase, "").replace(/^\//, "");
    return ORG_TABS.find((t) => t.segment === currentPath) ?? ORG_TABS[0];
  }, [pathname, activeOrgId]);

  const currentProjectTab = useMemo(() => {
    if (!projectId || !activeOrgId) return null;
    const projectBase = `/organizations/${activeOrgId}/projects/${projectId}`;
    const currentPath = pathname.replace(projectBase, "").replace(/^\//, "");
    return PROJECT_TABS.find((t) => t.segment === currentPath) ?? PROJECT_TABS[0];
  }, [pathname, projectId, activeOrgId]);

  // Filtered lists
  const filteredOrgs = useMemo(() => {
    if (!orgSearch.trim()) return orgs;
    return orgs.filter((org) =>
      org.name.toLowerCase().includes(orgSearch.toLowerCase())
    );
  }, [orgs, orgSearch]);

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projects;
    return projects.filter((p: any) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  // Reset states on close
  const handleOrgOpenChange = useCallback((open: boolean) => {
    setOrgOpen(open);
    if (!open) {
      setOrgSearch("");
      setOrgTabsOpen(false);
    }
  }, []);

  const handleProjectOpenChange = useCallback((open: boolean) => {
    setProjectOpen(open);
    if (!open) {
      setProjectSearch("");
      setProjectTabsOpen(false);
    }
  }, []);

  if (!mounted || isLoading) {
    return null;
  }

  function handleSelectOrg(org: (typeof orgs)[number]) {
    selectOrg(org.id);
    router.push(ROUTES.ORG_DETAIL(org.id));
    setOrgOpen(false);
  }

  function handleSelectProject(project: any) {
    router.push(ROUTES.PROJECT_DETAIL(activeOrgId!, project.id));
    setProjectOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className={cn(pageShellClass, "flex h-full items-center justify-between")}>
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Link href={ROUTES.HOME} className="font-semibold">
            WorkGraph
          </Link>
          {isAuthed && activeOrgId && (
            <>
              <Separator orientation="vertical" className="h-5" />

              <nav className="flex items-center gap-4 text-sm">
                {/* Org dropdown */}
                <DropdownMenu open={orgOpen} onOpenChange={handleOrgOpenChange}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Building2 className="size-4" />
                      {activeOrg?.name ?? "Select Organization"}
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-64 p-0 overflow-hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* First row: All Orgs + Current Org tabs */}
                    <div className="flex items-center gap-1 p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 flex-1 justify-start gap-2"
                        onClick={() => {
                          router.push(ROUTES.ORGANIZATIONS);
                          setOrgOpen(false);
                        }}
                      >
                        <Building2 className="size-4" />
                        All Organizations
                      </Button>
                      {activeOrg && (
                        <Button
                          variant={orgTabsOpen ? "secondary" : "ghost"}
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={() => setOrgTabsOpen(!orgTabsOpen)}
                        >
                          {activeOrg.name}
                          <ChevronDown className={cn("size-3.5 transition-transform", orgTabsOpen && "rotate-180")} />
                        </Button>
                      )}
                    </div>

                    {/* Org tabs submenu */}
                    {orgTabsOpen && activeOrg && (
                      <div className="border-b bg-muted/30">
                        <div className="p-1">
                          <DropdownMenuItem
                            className="gap-2 text-muted-foreground"
                            onClick={() => setOrgTabsOpen(false)}
                          >
                            <ArrowLeft className="size-4" />
                            Back
                          </DropdownMenuItem>
                          {ORG_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = currentOrgTab?.segment === tab.segment;
                            return (
                              <DropdownMenuItem
                                key={tab.segment}
                                className={cn("gap-2", isActive && "bg-muted")}
                                onClick={() => {
                                  router.push(
                                    `${ROUTES.ORG_DETAIL(activeOrgId)}${tab.segment ? `/${tab.segment}` : ""}`
                                  );
                                  setOrgOpen(false);
                                }}
                              >
                                <Icon className="size-4" />
                                {tab.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search input */}
                    <div className="sticky top-0 z-10 bg-background flex items-center gap-2 px-3 py-2 border-b">
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <input
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="Search organizations..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setOrgOpen(false);
                        }}
                      />
                    </div>

                    {/* Scrollable org list */}
                    <div className="max-h-[240px] overflow-y-auto overflow-x-hidden">
                      <div className="py-1">
                        {filteredOrgs.map((org) => (
                          <DropdownMenuItem
                            key={org.id}
                            className={cn(org.id === activeOrgId && "bg-muted")}
                            onClick={() => handleSelectOrg(org)}
                          >
                            {org.name}
                          </DropdownMenuItem>
                        ))}
                        {orgSearch && filteredOrgs.length === 0 && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No organizations found
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Projects dropdown */}
                <DropdownMenu open={projectOpen} onOpenChange={handleProjectOpenChange}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      {activeProject?.name ?? "Projects"}
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-64 p-0 overflow-hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* First row: All Projects + Current Project tabs */}
                    <div className="flex items-center gap-1 p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 flex-1 justify-start gap-2"
                        onClick={() => {
                          router.push(ROUTES.ORG_PROJECTS(activeOrgId));
                          setProjectOpen(false);
                        }}
                      >
                        <FolderOpen className="size-4" />
                        All Projects
                      </Button>
                      {activeProject && (
                        <Button
                          variant={projectTabsOpen ? "secondary" : "ghost"}
                          size="sm"
                          className="h-8 gap-1.5"
                          onClick={() => setProjectTabsOpen(!projectTabsOpen)}
                        >
                          {activeProject.name}
                          <ChevronDown className={cn("size-3.5 transition-transform", projectTabsOpen && "rotate-180")} />
                        </Button>
                      )}
                    </div>

                    {/* Project tabs submenu */}
                    {projectTabsOpen && activeProject && (
                      <div className="border-b bg-muted/30">
                        <div className="p-1">
                          <DropdownMenuItem
                            className="gap-2 text-muted-foreground"
                            onClick={() => setProjectTabsOpen(false)}
                          >
                            <ArrowLeft className="size-4" />
                            Back
                          </DropdownMenuItem>
                          {PROJECT_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = currentProjectTab?.segment === tab.segment;
                            return (
                              <DropdownMenuItem
                                key={tab.segment}
                                className={cn("gap-2", isActive && "bg-muted")}
                                onClick={() => {
                                  router.push(
                                    `${ROUTES.PROJECT_DETAIL(activeOrgId, projectId!)}${tab.segment ? `/${tab.segment}` : ""}`
                                  );
                                  setProjectOpen(false);
                                }}
                              >
                                <Icon className="size-4" />
                                {tab.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search input */}
                    <div className="sticky top-0 z-10 bg-background flex items-center gap-2 px-3 py-2 border-b">
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <input
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="Search projects..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setProjectOpen(false);
                        }}
                      />
                    </div>

                    {/* Scrollable project list */}
                    <div className="max-h-[240px] overflow-y-auto overflow-x-hidden">
                      <div className="py-1">
                        {filteredProjects.map((p: any) => (
                          <DropdownMenuItem
                            key={p.id}
                            className={cn(p.id === projectId && "bg-muted")}
                            onClick={() => handleSelectProject(p)}
                          >
                            {p.name}
                          </DropdownMenuItem>
                        ))}
                        {projectSearch && filteredProjects.length === 0 && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No projects found
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </>
          )}
        </div>
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <AuthButton onLogout={logout} isAuthenticated={isAuthed} />
        </div>
      </div>
    </header>
  );
}
