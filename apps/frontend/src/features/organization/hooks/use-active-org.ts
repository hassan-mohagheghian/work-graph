"use client";

import { useEffect, useState } from "react";
import { getActiveOrg, setActiveOrg } from "../model/active-org";

export function useActiveOrg() {
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActiveOrgId(getActiveOrg());
    setMounted(true);
  }, []);

  function selectOrg(orgId: string) {
    setActiveOrg(orgId);
    setActiveOrgId(orgId);
  }

  return {
    activeOrgId,
    selectOrg,
    mounted,
  };
}
