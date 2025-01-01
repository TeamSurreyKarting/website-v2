"use client";

import { Database } from "@/database.types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/tasks/kanban-board/task-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import clsx from "clsx";

export default function TasksKanbanBoard({
  tasks,
  className,
  showSubtasks = false,
  authedUserId,
}: {
  tasks: Database["public"]["Views"]["TaskDetailsView"]["Row"][];
  className?: string;
  showSubtasks?: boolean;
  authedUserId: string;
}) {
  const groups: {
    name: Database["public"]["Enums"]["task_status"];
    description: string;
  }[] = [
    {
      name: "Open",
      description:
        "Tasks awaiting initiation. They have been defined and assigned but have not yet begun.",
    },
    { name: "In Progress", description: "Tasks being actively worked on." },
    {
      name: "Blocked",
      description:
        "Tasks that have been started but are currently unable to progress.",
    },
    {
      name: "Completed",
      description: "Tasks that have been successfully finished.",
    },
    {
      name: "Cancelled",
      description:
        "Tasks that have been formally discontinued and will not be pursued further.",
    },
  ];

  const draggingEventDidEnd = (event: DragEndEvent) => {
    console.log("dragging event complete", event);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const activeIsOfTypeTask = active.data.current?.type === "Task";
    const overIsOfTypeTask = active.data.current?.type === "Task";

    // only permit dragging tasks
    if (!activeIsOfTypeTask) return;

    // fixme: handle dropping over column
  };

  return (
    <DndContext onDragEnd={draggingEventDidEnd} onDragOver={onDragOver}>
      <div
        className={cn(
          `grid grid-cols-5 gap-4 h-full w-full overflow-x-scroll`,
          className,
        )}
      >
        {groups.map((group) => {
          const { isOver, setNodeRef } = useDroppable({
            id: `droppable-${group}`,
            data: {
              type: "Column",
              group,
            },
          });

          let groupTasks = tasks.filter((x) => x.status === group.name);

          // only show parent tasks for each group
          if (!showSubtasks) {
            groupTasks = groupTasks.filter((x) => !x.parent_task);
          }

          return (
            <div
              ref={setNodeRef}
              key={group.name}
              className={
                "rounded-lg bg-ts-blue-600 border border-ts-blue-300 text-white min-w-[200px]"
              }
            >
              <div
                className={
                  "bg-ts-blue-400 px-2 py-1 flex items-center justify-between"
                }
              >
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <h3 className={"text-lg font-medium hover:underline"}>
                          {group.name}
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{group.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge
                  variant="default"
                  className={"bg-ts-blue-200 border border-white"}
                >
                  {groupTasks.length}
                </Badge>
              </div>
              <div
                className={clsx("p-2 flex flex-col gap-2", {
                  "bg-ts-blue-400 border border-ts-gold border-dashed": isOver,
                })}
              >
                {groupTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    authedUserId={authedUserId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
