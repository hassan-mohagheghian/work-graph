"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useProjectMembers } from "@/features/project/hooks/use-project-members";
import { AddProjectMemberSheet } from "@/features/project/components/add-project-member-sheet";
import { useRemoveProjectMember } from "@/features/project/hooks/use-remove-project-member";
import { useUpdateProjectMemberRole } from "@/features/project/hooks/use-update-project-member-role";
import { PageBody, SectionHeader } from "@/shared/layout/page-layout";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Plus } from "lucide-react";

export default function ProjectMembersPage() {
  const params = useParams();

  const projectId = params.projectId as string;
  const orgId = params.organizationId as string;

  const { data: members = [], isLoading } = useProjectMembers(projectId);

  const updateRole = useUpdateProjectMemberRole(projectId);
  const removeMember = useRemoveProjectMember(projectId);

  const [addOpen, setAddOpen] = useState(false);

  if (isLoading) {
    return <p>Loading members...</p>;
  }

  return (
    <PageBody>
      <SectionHeader
        title="Project Members"
        description="Members assigned to this project"
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4 mr-1" />
            Add Member
          </Button>
        }
      />

      {members.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No project members yet. Add one to get started.
            </p>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4 mr-1" />
              Add Member
            </Button>
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

      <AddProjectMemberSheet
        orgId={orgId}
        projectId={projectId}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </PageBody>
  );
}
