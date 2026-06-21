import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Task } from "../types/task";
import { Button } from "@/shared/ui/button";

export function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{task.title}</h3>

          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {task.description || "No description"}
        </p>

        <div className="mt-2 text-xs">
          Status: <strong>{task.status}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
