import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/tasks/kanban-board/task-card";
import { getAuthedUserId } from "@/utils/db-fns/auth/get-user-id";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className={className}>
      <div className={"flex flex-row gap-3 items-center justify-between"}>
        <div className={"flex flex-row gap-2.5"}>
          <h3 className={"text-lg font-medium"}>Subtasks</h3>
          <Badge
            variant="default"
            className={"rounded-full bg-ts-blue-200 border border-white"}
          >
            {subtasks.length}
          </Badge>
        </div>
        <Link href={`/tasks/new?parentTask=${taskId}`}>
          <Button
            className={
              "bg-ts-blue-400 border border-ts-blue-300 hover:bg-ts-blue-200"
            }
            size={"sm"}
          >
            <FaPlus />
          </Button>
        </Link>
      </div>
      <div className={"flex flex-col gap-2 mt-3"}>
        {subtasks.map((s) => (
          <TaskCard key={s.id} task={s} authedUserId={authedUserId} />
        ))}
      </div>
    </div>
  );
}
