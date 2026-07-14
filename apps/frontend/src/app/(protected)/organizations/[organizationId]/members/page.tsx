"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useMembers } from "@/features/organization/hooks/use-members";
import { InviteMemberSheet } from "@/features/organization/components/invite-member-sheet";
import { PageBody, PageLoading, SectionHeader } from "@/shared/layout/page-layout";

import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Plus } from "lucide-react";

export default function MembersPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { members, loading, changeRole, remove } = useMembers(orgId);

  const [inviteOpen, setInviteOpen] = useState(false);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <PageBody>
      <SectionHeader
        title="Members"
        description="Manage organization members"
        actions={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <Plus className="size-4 mr-1" />
            Invite Member
          </Button>
        }
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              members.map((m) => (
                <TableRow key={m.user_id}>
                  <TableCell className="font-medium">{m.email}</TableCell>

                  <TableCell>
                    <Select
                      value={m.role}
                      onValueChange={(value) =>
                        changeRole(m.user_id, value as any)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(m.user_id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InviteMemberSheet
        orgId={orgId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </PageBody>
  );
}
