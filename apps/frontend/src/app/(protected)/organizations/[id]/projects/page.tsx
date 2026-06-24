"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useProjects } from "@/features/project/hooks/use-projects";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { Button } from "@/shared/ui/button";

export default function ProjectsPage() {
  const params = useParams();

  const orgId = params.id as string;

  const { data, isLoading } = useProjects(orgId);

  if (!orgId) return <p>Select organization</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {" "}
      <h1 className="text-xl font-semibold mb-4">Projects </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Members</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>

              <TableCell className="text-muted-foreground">
                {project.id}
              </TableCell>

              <TableCell>{project.status ?? "active"}</TableCell>

              <TableCell className="text-right">
                <Link
                  href={`/organizations/${orgId}/projects/${project.id}/members`}
                >
                  <Button size="sm" variant="outline">
                    Members
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
