"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { useProjects } from "@/features/project/hooks/use-projects";
import { useParams } from "next/navigation";

export default function ProjectsPage() {
  const params = useParams();
  const orgId = params.id as string;
  const { data, isLoading } = useProjects(orgId);

  if (!orgId) return <p>Select organization</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Projects</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>

              <TableCell className="text-muted-foreground">
                {project.id}
              </TableCell>

              <TableCell className="text-right">
                {project.status ?? "active"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
