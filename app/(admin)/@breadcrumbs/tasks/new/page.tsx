import { createClient } from "@/utils/supabase/server";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default async function BreadcrumbSlot({
  searchParams,
}: {
  searchParams: Promise<{ parentTask?: string }>;
}) {
  const parentTaskId = (await searchParams)?.parentTask;
  const parentTaskName = parentTaskId
    ? await fetchTaskName(parentTaskId)
    : null;

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink className={"text-gray-300"} href={"/tasks"}>
          Tasks
        </BreadcrumbLink>
      </BreadcrumbItem>
      {parentTaskId && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className={"text-gray-300"}
              href={`/tasks/${parentTaskId}`}
            >
              {parentTaskName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className={"text-white capitalize"}>
          Add {parentTaskId ? "Subtask" : "Task"}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
