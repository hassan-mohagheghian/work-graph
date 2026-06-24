"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useProjectMembers } from "@/features/project/hooks/use-project-members";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useAddProjectMember } from "@/features/project/hooks/use-add-project-member";
import { useRemoveProjectMember } from "@/features/project/hooks/use-remove-project-member";
import { useUpdateProjectMemberRole } from "@/features/project/hooks/use-update-project-member-role";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export default function ProjectMembersPage() {
  const params = useParams();

  const projectId = params.projectId as string;
  const orgId = params.id as string;

  const { data: members = [], isLoading } = useProjectMembers(projectId);

  const addMember = useAddProjectMember(projectId);
  const updateRole = useUpdateProjectMemberRole(projectId);
  const removeMember = useRemoveProjectMember(projectId);

  const [email, setEmail] = useState("");

  if (isLoading) {
    return <p>Loading members...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Project Members</h1>

        <p className="text-sm text-muted-foreground">
          Members assigned to this project
        </p>
      </div>

      {/* ADD MEMBER */}
      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={() => {
            addMember.mutate({
              org_id: orgId,
              email,
            });
            setEmail("");
          }}
        >
          Add Member
        </Button>
      </div>

      {members.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No project members found
          </CardContent>
        </Card>
      )}

      {members.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member: any) => (
              <TableRow key={member.id}>
                <TableCell>{member.user_id}</TableCell>

                <TableCell>
                  <Select
                    value={member.role}
                    onValueChange={(role) =>
                      updateRole.mutate({
                        userId: member.user_id,
                        role,
                      })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
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
                    onClick={() => removeMember.mutate(member.user_id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
