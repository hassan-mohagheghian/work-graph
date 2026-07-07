"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

import { AuthButton } from "@/features/auth/components/auth-button";
import { useMe } from "@/features/auth/hooks/use-me";

import { useActiveOrg } from "@/features/organization/hooks/use-active-org";
import { useOrganizations } from "@/features/organization/hooks/use-organizations";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";

import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { ROUTES } from "@/shared/routes";
import {
  FolderOpen,
  FileText,
  Map,
  CheckSquare,
  Users,
  Settings,
} from "lucide-react";

// Ordered by workflow: docs → roadmap (with milestones) → tasks
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

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === activeOrgId),
    [orgs, activeOrgId],
  );

  // Extract projectId from pathname if we're in a project context
  const projectId = useMemo(() => {
    if (!activeOrgId) return null;
    const match = pathname.match(
      new RegExp(`/organizations/${activeOrgId}/projects/([^/]+)`)
    );
    return match ? match[1] : null;
  }, [pathname, activeOrgId]);

  if (!mounted || isLoading) {
    return null;
  }

  function handleSelect(org: (typeof orgs)[number]) {
    selectOrg(org.id);
    router.push(ROUTES.ORG_PROJECTS(org.id));
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Link href={ROUTES.HOME} className="font-semibold">
            WorkGraph
          </Link>
          {isAuthed && activeOrgId && (
            <>
              <Separator orientation="vertical" className="h-5" />

              <nav className="flex items-center gap-5 text-sm">
                <Link href={ROUTES.ORG_PROJECTS(activeOrgId)}>
                  Projects
                </Link>

                {/* Project subsections dropdown */}
                {projectId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        Project Sections
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {PROJECT_TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <DropdownMenuItem
                            key={tab.segment}
                            onClick={() =>
                              router.push(
                                `${ROUTES.PROJECT_DETAIL(activeOrgId, projectId)}${tab.segment ? `/${tab.segment}` : ""}`
                              )
                            }
                          >
                            <Icon className="size-4 mr-2" />
                            {tab.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>
            </>
          )}
        </div>
        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {isAuthed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {activeOrg?.name ?? "Select Organization"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                {activeOrgId && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(ROUTES.ORG_MEMBERS(activeOrgId))
                      }
                    >
                      Members
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        router.push(ROUTES.ORG_SETTINGS(activeOrgId))
                      }
                    >
                      Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                  </>
                )}

                {orgs.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleSelect(org)}
                  >
                    {org.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <AuthButton onLogout={logout} isAuthenticated={isAuthed} />
        </div>
      </div>
    </header>
  );
}
