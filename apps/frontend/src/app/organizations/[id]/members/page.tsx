"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useMembers } from "@/features/organization/hooks/use-members";

import { Input } from "@/shared/ui/input";
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

export default function MembersPage() {
  const params = useParams();
  const orgId = params.id as string;

  const { members, loading, changeRole, remove, invite } = useMembers(orgId);

  const [email, setEmail] = useState("");

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* INVITE SECTION */}
      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Invite user by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={() => {
            invite(email, "member");
            setEmail("");
          }}
        >
          Invite
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg">
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
                  {/* EMAIL */}
                  <TableCell className="font-medium">{m.email}</TableCell>

                  {/* ROLE */}
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

                  {/* ACTIONS */}
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
    </div>
  );
}
