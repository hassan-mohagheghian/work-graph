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

export function Header() {
  const { activeOrgId, selectOrg, mounted } = useActiveOrg();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrgName, setActiveOrgName] = useState("Select org");

  useEffect(() => {
    getOrganizations().then(setOrgs);
  }, []);

  useEffect(() => {
    const current = orgs.find((o) => o.id === activeOrgId);
    setActiveOrgName(current?.name || "Select org");
  }, [activeOrgId, orgs]);

  if (!mounted) return null;

  function handleSelect(org: Organization) {
    selectOrg(org.id);
  }

  return (
    <header className="w-full border-b px-4 h-14 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Link href="/" className="font-semibold">
          WorkGraph
        </Link>

        <Separator orientation="vertical" className="h-5" />

        {/* NAV (ORG-BASED ROUTES) */}
        {activeOrgId && (
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href={`/organizations/${activeOrgId}/projects`}
              className="hover:underline"
            >
              Projects
            </Link>

            <Link
              href={`/organizations/${activeOrgId}/members`}
              className="hover:underline"
            >
              Members
            </Link>
          </nav>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* ORG SWITCHER */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {activeOrgName}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            {orgs.map((org) => (
              <DropdownMenuItem key={org.id} onClick={() => handleSelect(org)}>
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* USER */}
        <AuthButton />
      </div>
    </header>
  );
}
