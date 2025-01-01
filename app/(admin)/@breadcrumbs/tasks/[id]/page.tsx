import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getTask(
  id: string,
): Promise<Database["public"]["Views"]["TaskDetailsView"]["Row"]> {
  const supabase = await createClient();

  const { data: task, error } = await supabase
    .from("TaskDetailsView")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;

  return task;
}

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const taskId = (await params)?.id;

  if (!taskId) return null;

  const task = await getTask(taskId);

  if (!task.parent_task) {
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className={"text-gray-300"} href={"/tasks"}>
            Tasks
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className={"text-white capitalize"}>
            {task.title ?? taskId}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  }

  const parentTask = await getTask(task.parent_task);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink className={"text-gray-300"} href={"/tasks"}>
          Tasks
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          className={"text-gray-300"}
          href={`/tasks/${parentTask.id}`}
        >
          {parentTask.title ?? taskId}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className={"text-white capitalize"}>
          {task.title ?? taskId}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
