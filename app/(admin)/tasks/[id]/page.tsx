import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { EditTaskDetails } from "@/components/forms/tasks/edit-minor-details";
import TitleEdit from "@/components/tasks/ui/title-edit";
import clsx from "clsx";
import Comments from "@/components/tasks/ui/comments";
import Subtasks from "@/components/tasks/ui/subtasks";
import TaskDescription from "@/components/tasks/ui/description";
import TaskAssignees from "@/components/tasks/ui/assignees";
import { CommentWithAuthorDetails } from "@/utils/db-fns/tasks/types/comment-with-author-details";
import { TaskAssignmentWithAuthorDetails } from "@/utils/db-fns/tasks/types/task-assignment-with-author-details";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

async function getTask(id: string): Promise<Database["public"]["Views"]["TaskDetailsView"]["Row"]> {
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

async function getTaskComments(taskId: string): Promise<CommentWithAuthorDetails[] | null> {
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("TaskComments")
    .select("id, task, authored_by:Racers( id, fullName ), created_at, content")
    .eq("task", taskId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return comments;
}

async function getTaskAssignments(taskId: string): Promise<TaskAssignmentWithAuthorDetails[] | null> {
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("TaskAssignees")
    .select("task, assigned_at, assigned_by:Racers!TaskAssignments_assigned_by_fkey1( id, fullName ), assigned_to:Racers!TaskAssignments_assigned_to_fkey1( id, fullName )")
    .eq("task", taskId);

  if (error) throw error;

  return assignments;
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const taskId = (await params).id;

  const [
    task,
    taskComments,
    taskAssignments,
  ] = await Promise.all([
    getTask(taskId),
    getTaskComments(taskId),
    getTaskAssignments(taskId),
  ]);

  return (
    <div className={"container mx-auto"}>
      <TitleEdit defaultValue={task.title!} taskId={taskId} />
      <Card
        className={"my-2"}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-x-2 mb-3">
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
        </CardHeader>
        <CardContent className={"gap-3 grid md:grid-cols-3 grid-flow-row"}>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Due Date</strong>
            <span>{format(new Date(task.due_at!), 'PPP, HH:mm')}</span>
          </div>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Priority</strong>
            <span>{task.priority}</span>
          </div>
          <div className={"flex flex-col gap-1 items-left"}>
            <strong>Status</strong>
            <span>{task.status}</span>
          </div>
        </CardContent>
      </Card>
      <TaskAssignees
        taskId={taskId}
        primaryResponsiblePerson={
          {
            id: task.primarily_responsible_person_id!,
            fullName: task.primarily_responsible_person_full_name!,
          }
        }
        assignments={taskAssignments}
      />
      <TaskDescription
        taskId={taskId}
        defaultValue={task.description!}
      />
      <div
        className={clsx("grid gap-6 md:gap-3 grid-cols-1 mt-6", {
          "grid-cols-1 md:grid-cols-[3fr_2fr]": task.parent_task === null,
        })}
      >
        {task.parent_task === null && (
          <Subtasks
            taskId={taskId}
          />
        )}
        { taskComments && (
          <Comments
            taskId={taskId}
            comments={taskComments}
          />
        )}
      </div>
    </div>
  );
}
