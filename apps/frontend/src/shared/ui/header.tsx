"use client";

import Link from "next/link";
import { AuthButton } from "../../features/auth/components/auth-button";

import { useEffect, useState } from "react";
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

export function Header() {
  const { activeOrgId, selectOrg, mounted } = useActiveOrg();

  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrgName, setActiveOrgName] = useState("Select org");

  // load orgs
  useEffect(() => {
    async function load() {
      const data = await getOrganizations();
      setOrgs(data);
    }
    load();
  }, []);

  // resolve active org name
  useEffect(() => {
    const current = orgs.find((o) => o.id === activeOrgId);
    setActiveOrgName(current?.name || "Select org");
  }, [activeOrgId, orgs]);

  if (!mounted) return null;

  function handleSelect(org: Organization) {
    selectOrg(org.id);
  }

  return (
    <header className="w-full border-b px-4 py-3 flex items-center justify-between">
      {/* LEFT */}
      <Link href="/" className="font-semibold">
        WorkGraph
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Org Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {activeOrgName}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {orgs.map((org) => (
              <DropdownMenuItem key={org.id} onClick={() => handleSelect(org)}>
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Auth */}
        <AuthButton />
      </div>
    </header>
  );
}
