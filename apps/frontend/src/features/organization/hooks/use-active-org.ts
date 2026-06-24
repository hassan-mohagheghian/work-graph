"use client";

import { useEffect, useState } from "react";

import {
  getActiveOrg,
  setActiveOrg,
  clearActiveOrg,
} from "../model/active-org";

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

  function clearOrg() {
    clearActiveOrg();
    setActiveOrgId(null);
  }

  return {
    activeOrgId,
    selectOrg,
    clearOrg,
    mounted,
  };
}
