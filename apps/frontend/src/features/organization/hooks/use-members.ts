"use client";

import { useEffect, useState } from "react";
import {
  OrgMember,
  getMembers,
  updateMemberRole,
  removeMember,
  addMember,
  Role,
} from "../api/members";

export function useMembers(orgId: string | null) {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!orgId) return;

    setLoading(true);
    const data = await getMembers(orgId);
    setMembers(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [orgId]);

  async function changeRole(userId: string, role: Role) {
    if (!orgId) return;

    await updateMemberRole(orgId, userId, role);
    await load();
  }

  async function remove(userId: string) {
    if (!orgId) return;

    await removeMember(orgId, userId);
    await load();
  }

  async function invite(email: string, role: Role) {
    if (!orgId) return;

    await addMember(orgId, email, role);
    await load();
  }

  return {
    members,
    loading,
    changeRole,
    remove,
    invite,
  };
}
