"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

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

export function Header() {
  const router = useRouter();

  const { activeOrgId, selectOrg, mounted } = useActiveOrg();

  const { data: user, isLoading } = useMe();
  const { logout } = useLogout();

  const isAuthed = !!user;

  const { data: orgs = [] } = useOrganizations(isAuthed);

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === activeOrgId),
    [orgs, activeOrgId],
  );

  if (!mounted || isLoading) {
    return null;
  }

  function handleSelect(org: (typeof orgs)[number]) {
    selectOrg(org.id);
    router.push(`/organizations/${org.id}/projects`);
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      {" "}
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* LEFT */}{" "}
        <div className="flex items-center gap-4">
          {" "}
          <Link href="/" className="font-semibold">
            WorkGraph{" "}
          </Link>
          {isAuthed && activeOrgId && (
            <>
              <Separator orientation="vertical" className="h-5" />

              <nav className="flex items-center gap-5 text-sm">
                <Link href={`/organizations/${activeOrgId}/projects`}>
                  Projects
                </Link>

                <Link href={`/organizations/${activeOrgId}/tasks`}>Tasks</Link>
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
                        router.push(`/organizations/${activeOrgId}/members`)
                      }
                    >
                      Members
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled>
                      Organization Settings
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
