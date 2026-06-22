"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AuthButton } from "@/features/auth/components/auth-button";
import { useActiveOrg } from "@/features/organization/hooks/use-active-org";

import {
  getOrganizations,
  Organization,
} from "@/features/organization/api/get-organizations";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";

import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { activeOrgId, selectOrg, mounted } = useActiveOrg();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // replace later with real auth state
    setIsAuthed(true);
  }, []);

  useEffect(() => {
    if (isAuthed) {
      getOrganizations().then(setOrgs);
    }
  }, [isAuthed]);

  if (!mounted) return null;

  function handleSelect(org: Organization) {
    selectOrg(org.id);
    router.push(`/organizations/${org.id}/projects`);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background  border-b px-4 h-16 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link href="/" className="font-semibold">
          WorkGraph
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {/* NAV ONLY IF AUTH + ORG */}
        {isAuthed && activeOrgId && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href={`/organizations/${activeOrgId}/projects`}>
              Projects
            </Link>
            <Link href={`/organizations/${activeOrgId}/tasks`}>Tasks</Link>
          </nav>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <Link href={`/organizations/${activeOrgId}/members`}>Members</Link>
        {/* ORG SWITCHER ONLY WHEN AUTH */}
        {isAuthed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {activeOrgId ?? "Select org"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
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

        {/* ALWAYS SHOW */}
        <AuthButton />
      </div>
    </header>
  );
}
