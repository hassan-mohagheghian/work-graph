"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useProjects } from "@/features/project/hooks/use-projects";
import { ROUTES } from "@/shared/routes";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, FolderOpen, FileText, Map, CheckSquare, Users, Settings } from "lucide-react";

export default function ProjectsPage() {
  const params = useParams();
  const orgId = params.organizationId as string;

  const { data, isLoading } = useProjects(orgId);

  if (!orgId) return <p>Select organization</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your projects
          </p>
        </div>
        <Link href={ROUTES.PROJECT_NEW(orgId)}>
          <Button>New Project</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No projects yet
                </TableCell>
              </TableRow>
            ) : (
              data?.map((project: any) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
