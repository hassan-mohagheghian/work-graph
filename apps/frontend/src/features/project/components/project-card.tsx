import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Project } from "../types/project";
import { Button } from "@/shared/ui/button";

export function ProjectCard({
  project,
  onDelete,
  onOpen,
}: {
  project: Project;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold" onClick={() => onOpen(project.id)}>
            {project.name}
          </h3>

          <Button variant="destructive" onClick={() => onDelete(project.id)}>
            Delete
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {project.description || "No description"}
        </p>
      </CardContent>
    </Card>
  );
}
