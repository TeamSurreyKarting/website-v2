import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { EditTaskDetails } from "@/components/forms/tasks/edit-minor-details";
import TitleEdit from "@/components/tasks/ui/title-edit";
import clsx from "clsx";
import Comments from "@/components/tasks/ui/comments";
import Subtasks from "@/components/tasks/ui/subtasks";
import TaskDescription from "@/components/tasks/ui/description";

async function getTask(
  id: string,
): Promise<Database["public"]["Views"]["TaskDetailsView"]["Row"]> {
  const supabase = await createClient();

  const { data: task, error } = await supabase
    .from("TaskDetailsView")
    .select(
      "assignees,comment_count,created_at,created_by_full_name,created_by_id,description,due_at,id,parent_task,primarily_responsible_person_full_name,primarily_responsible_person_id,priority,status,subtasks_completed,subtasks_total,title,updated_at",
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return task;
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const taskId = (await params).id;

  const task = await getTask(taskId);

  return (
    <>
      <TitleEdit defaultValue={task.title!} taskId={taskId} />
      <div
        className={"rounded-lg bg-ts-blue border border-ts-blue-400 p-6 my-2 "}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-2 mb-3">
          <h3 className={"text-xl font-medium"}>Task Details</h3>
          <EditTaskDetails
            values={{
              dueAt: new Date(task.due_at!),
              status: task.status!,
              priority: task.priority!,
              primaryResponsiblePerson: task.primarily_responsible_person_id!,
            }}
            taskId={taskId}
          />
        </div>
        <div className={"gap-3 grid md:grid-cols-2 grid-flow-row p-3"}>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Due Date</strong>
            <span>{new Date(task.due_at!).toLocaleString("en-GB")}</span>
          </div>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Priority</strong>
            <span>{task.priority}</span>
          </div>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Status</strong>
            <span>{task.status}</span>
          </div>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Primary Responsible Person</strong>
            <Link href={`/racers/${task.primarily_responsible_person_id}`}>
              {task.primarily_responsible_person_full_name}
            </Link>
          </div>
        </div>
      </div>
      <TaskDescription taskId={taskId} defaultValue={task.description!} />
      <div
        className={clsx("grid gap-6 md:gap-3 grid-cols-1 mt-6", {
          "grid-cols-1 md:grid-cols-[3fr_2fr]": task.parent_task === null,
        })}
      >
        {task.parent_task === null && (
          <Subtasks
            taskId={taskId}
            className={"rounded-lg bg-ts-blue border border-ts-blue-400 p-4"}
          />
        )}
        <Comments
          taskId={taskId}
          className={"rounded-lg bg-ts-blue border border-ts-blue-400 p-4"}
        />
      </div>
    </>
  );
}
