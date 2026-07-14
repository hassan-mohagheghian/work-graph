"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

import { CreateProjectSheet } from "@/features/project/components/create-project-sheet";
import { useProjects } from "@/features/project/hooks/use-projects";
import { ROUTES } from "@/shared/routes";
import { PageBody, SectionHeader, PageLoading } from "@/shared/layout/page-layout";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, FolderOpen, FileText, Map, CheckSquare, Users, Settings, Plus } from "lucide-react";

export default function ProjectsPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { data, isLoading } = useProjects(orgId);
  const [createOpen, setCreateOpen] = useState(false);

  if (!orgId) return <p className="text-sm text-muted-foreground">Select organization</p>;

  if (isLoading) return <PageLoading />;

  return (
    <>
      <PageBody spacing="tight">
        <SectionHeader
          title="Projects"
          description="Manage your projects"
          actions={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4 mr-1" />
              New Project
            </Button>
          }
        />

        {data?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No projects yet. Create one to get started.
              </p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="size-4 mr-1" />
                New Project
              </Button>
            </CardContent>
          </Card>
        )}

        {data && data.length > 0 && (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((project: any) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={ROUTES.PROJECT_DETAIL(orgId, project.id)}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.status ?? "active"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_DETAIL(orgId, project.id)
                            }
                          >
                            <FolderOpen className="size-4 mr-2" />
                            Overview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_DOCUMENTS(orgId, project.id)
                            }
                          >
                            <FileText className="size-4 mr-2" />
                            Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_ROADMAP(orgId, project.id)
                            }
                          >
                            <Map className="size-4 mr-2" />
                            Roadmap
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_TASKS(orgId, project.id)
                            }
                          >
                            <CheckSquare className="size-4 mr-2" />
                            Tasks
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_MEMBERS(orgId, project.id)
                            }
                          >
                            <Users className="size-4 mr-2" />
                            Members
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.location.href = ROUTES.PROJECT_SETTINGS(orgId, project.id)
                            }
                          >
                            <Settings className="size-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </PageBody>

      <CreateProjectSheet
        orgId={orgId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
