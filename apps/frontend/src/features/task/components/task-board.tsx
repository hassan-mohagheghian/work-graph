"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateTask } from "../hooks/use-update-task";
import { useDeleteTask } from "../hooks/use-delete-task";
import { useReorderTasks } from "../hooks/use-reorder-tasks";
import { useOrg } from "@/shared/context/org-context";
import { EditTaskSheet } from "./edit-task-sheet";
import { CreateTaskSheet } from "./create-task-sheet";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-gray-500" },
  { id: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
] as const;

const COLUMN_BG: Record<string, string> = {
  todo: "bg-gray-50",
  in_progress: "bg-yellow-50",
  done: "bg-green-50",
};

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition group"
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <GripVertical className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <p className="text-sm font-medium truncate cursor-pointer">
            {task.title}
          </p>
          {(task.roadmap_title || task.milestone_title) && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {task.roadmap_title && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {task.roadmap_title}
                </Badge>
              )}
              {task.milestone_title && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {task.milestone_title}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DraggableOverlay({ task }: { task: any }) {
  return (
    <div className="bg-white rounded-lg border p-3 shadow-lg opacity-90 rotate-2 w-64">
      <p className="text-sm font-medium truncate">{task.title}</p>
    </div>
  );
}

export function TaskBoard({
  tasks,
  projectId,
}: {
  tasks: any[];
  projectId: string;
}) {
  const { orgId } = useOrg();
  const updateTask = useUpdateTask(orgId);
  const deleteTask = useDeleteTask(orgId);
  const reorderTasks = useReorderTasks(orgId);

  const [activeTask, setActiveTask] = useState<any>(null);

  const [editTask, setEditTask] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Track local order for optimistic UI
  const [localTasks, setLocalTasks] = useState<any[]>(tasks);
  const tasksByStatus = {
    todo: localTasks.filter((t: any) => t.status === "todo"),
    in_progress: localTasks.filter((t: any) => t.status === "in_progress"),
    done: localTasks.filter((t: any) => t.status === "done"),
  };

  // Sync when tasks prop changes (e.g. after mutation)
  if (tasks.length !== localTasks.length || tasks[0]?.id !== localTasks[0]?.id) {
    setLocalTasks(tasks);
  }

  function handleDragStart(event: DragStartEvent) {
    const task = localTasks.find((t: any) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = localTasks.find((t: any) => t.id === taskId);
    if (!task) return;

    let newStatus: string | null = null;
    let overId = over.id as string;

    if (["todo", "in_progress", "done"].includes(overId)) {
      newStatus = overId;
    } else {
      const overTask = localTasks.find((t: any) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (!newStatus) return;

    if (newStatus === task.status) {
      // Reorder within same column
      const colTasks = localTasks.filter(
        (t: any) => t.status === task.status
      );
      const oldIdx = colTasks.findIndex((t: any) => t.id === taskId);
      const newIdx = colTasks.findIndex((t: any) => t.id === overId);

      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(colTasks, oldIdx, newIdx);
        const otherTasks = localTasks.filter(
          (t: any) => t.status !== task.status
        );
        const updated = [...otherTasks, ...reordered];
        setLocalTasks(updated);

        reorderTasks.mutate({
          projectId,
          orderedIds: updated.map((t: any) => t.id),
        });
      }
    } else {
      // Move to different column
      const updated = localTasks.map((t: any) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setLocalTasks(updated);

      updateTask.mutate({
        taskId,
        data: { status: newStatus },
      });

      // Reorder the target column
      const colTasks = updated.filter((t: any) => t.status === newStatus);
      reorderTasks.mutate({
        projectId,
        orderedIds: updated.map((t: any) => t.id),
      });
    }
  }

  function handleEdit(task: any) {
    setEditTask(task);
    setEditOpen(true);
  }

  function handleDelete(taskId: string) {
    deleteTask.mutate(taskId);
  }

  function handleAddClick(status: string) {
    setCreateStatus(status);
    setCreateOpen(true);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <DroppableColumn
              key={col.id}
              id={col.id}
              label={col.label}
              color={col.color}
              tasks={tasksByStatus[col.id]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddClick={handleAddClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <DraggableOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {editTask && (
        <EditTaskSheet
          task={editTask}
          projectId={projectId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      <CreateTaskSheet
        projectId={projectId}
        defaultStatus={createStatus}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}

function DroppableColumn({
  id,
  label,
  color,
  tasks,
  onEdit,
  onDelete,
  onAddClick,
}: {
  id: string;
  label: string;
  color: string;
  tasks: any[];
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
  onAddClick: (status: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 transition-colors min-h-[200px] ${
        isOver ? "border-primary/50 bg-primary/5" : "border-transparent"
      } ${COLUMN_BG[id]}`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`size-2.5 rounded-full ${color}`} />
            <h3 className="text-sm font-semibold">{label}</h3>
            <span className="text-xs text-muted-foreground bg-white/80 px-1.5 py-0.5 rounded-full">
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onAddClick(id)}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <SortableContext
          items={tasks.map((t: any) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
              />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
