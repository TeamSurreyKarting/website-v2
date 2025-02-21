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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    {
      name: "In Progress",
      description: "Tasks being actively worked on." },
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

  return (
    <div className={"w-full h-full overflow-x-auto"}>
      <div
        className={cn(
          `grid grid-cols-5 gap-4 h-full w-full no-scrollbar overflow-x-auto`,
          className,
        )}
      >
        {groups.map((group) => {
          let groupTasks = tasks.filter((x) => x.status === group.name);

          // only show parent tasks for each group
          if (!showSubtasks) {
            groupTasks = groupTasks.filter((x) => !x.parent_task);
          }

          return (
            <Card
              key={group.name}
              className={
                "min-w-[200px] overflow-hidden flex-shrink-0"
              }
            >
              <CardHeader
                className={
                  "bg-ts-blue-300 px-2 py-1 flex flex-row items-center justify-between"
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
              </CardHeader>
              <CardContent
                className={"p-2 flex flex-col gap-2"}
              >
                {groupTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    authedUserId={authedUserId}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
