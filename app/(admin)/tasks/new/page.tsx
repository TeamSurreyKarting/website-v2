import { TaskForm } from "@/components/forms/tasks/new";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

async function fetchTaskName(taskId: string): Promise<string> {
  const supabase = await createClient();

  const { data: task, error } = await supabase
    .from("Tasks")
    .select("title")
    .eq("id", taskId)
    .single();

  if (error) throw error;

  return task.title;
}

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ parentTask?: string }>;
}) {
  try {
    const parentTaskId: string | undefined = (await searchParams)?.parentTask;
    const parentTaskName: string | null = parentTaskId
      ? await fetchTaskName(parentTaskId)
      : null;

    return (
      <>
        <h2 className={"text-2xl font-bold"}>
          New {parentTaskId ? "Subtask" : "Task"}
        </h2>
        {parentTaskName && (
          <h3 className={"text-xl font-medium  opacity-70"}>
            {parentTaskName}
          </h3>
        )}
        <TaskForm parentTaskId={parentTaskId} />
      </>
    );
  } catch {
    notFound();
  }
}
