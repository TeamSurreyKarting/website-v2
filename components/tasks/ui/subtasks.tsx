import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/tasks/kanban-board/task-card";
import { getAuthedUserId } from "@/utils/db-fns/auth/get-user-id";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function getSubtasks(
  parentTaskId: string,
): Promise<Database["public"]["Views"]["TaskDetailsView"]["Row"][]> {
  const supabase = await createClient();

  const { data: subtasks, error } = await supabase
    .from("TaskDetailsView")
    .select()
    .eq("parent_task", parentTaskId)
    .order("due_at", { ascending: false });

  if (error) throw error;

  return subtasks;
}

export default async function Subtasks({
  taskId,
  className,
}: {
  taskId: string;
  className?: string;
}) {
  const subtasks = await getSubtasks(taskId);

  const authedUserId = await getAuthedUserId();

  return (
    <Card className={className}>
      <CardHeader className={"flex flex-row gap-3 items-center justify-between"}>
        <div className={"flex flex-row gap-2.5"}>
          <h3 className={"text-lg font-medium"}>Subtasks</h3>
          <Badge
            variant="default"
            className={"rounded-full bg-ts-blue-200 border border-white text-foreground"}
          >
            {subtasks.length}
          </Badge>
        </div>
        <Link href={`/tasks/new?parentTask=${taskId}`}>
          <Button
            size={"sm"}
          >
            <FaPlus />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className={"flex flex-col gap-4"}>
        {subtasks.map((s) => (
          <TaskCard key={s.id} task={s} authedUserId={authedUserId} />
        ))}
      </CardContent>
    </Card>
  );
}
