import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";

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
          <AdminBreadcrumbLink className={"text-gray-300"} href={"/tasks"}>
            Tasks
          </AdminBreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <AdminBreadcrumbPage>
            {task.title ?? taskId}
          </AdminBreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  }

  const parentTask = await getTask(task.parent_task);

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/tasks"}>
          Tasks
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbLink
          href={`/tasks/${parentTask.id}`}
        >
          {parentTask.title ?? taskId}
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          {task.title ?? taskId}
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
