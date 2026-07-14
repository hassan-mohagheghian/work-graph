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
import { getErrorMessage } from "@/shared/lib/errors";
import { notify } from "@/shared/lib/notify";

export function useMembers(orgId: string | null) {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!orgId) return;

    setLoading(true);
    try {
      const data = await getMembers(orgId);
      setMembers(data);
    } catch (error) {
      notify.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orgId]);

  async function changeRole(userId: string, role: Role) {
    if (!orgId) return;

    try {
      await updateMemberRole(orgId, userId, role);
      await load();
      notify.success("Member role updated");
    } catch (error) {
      notify.error(getErrorMessage(error));
    }
  }

  async function remove(userId: string) {
    if (!orgId) return;

    try {
      await removeMember(orgId, userId);
      await load();
      notify.success("Member removed");
    } catch (error) {
      notify.error(getErrorMessage(error));
    }
  }

  async function invite(email: string, role: Role) {
    if (!orgId) return;

    try {
      await addMember(orgId, email, role);
      await load();
      notify.success("Member invited");
    } catch (error) {
      notify.error(getErrorMessage(error));
    }
  }

  return {
    members,
    loading,
    changeRole,
    remove,
    invite,
  };
}
