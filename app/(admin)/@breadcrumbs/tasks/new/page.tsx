import { createClient } from "@/utils/supabase/server";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminBreadcrumbLink, AdminBreadcrumbPage } from "@/components/admin-breadcrumbs";

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
    : (parentTaskId ?? "");

  return (
    <BreadcrumbList>
      <BreadcrumbItem>
        <AdminBreadcrumbLink href={"/tasks"}>
          Tasks
        </AdminBreadcrumbLink>
      </BreadcrumbItem>
      {parentTaskId && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <AdminBreadcrumbLink
              href={`/tasks/${parentTaskId}`}
            >
              {parentTaskName}
            </AdminBreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <AdminBreadcrumbPage>
          Add {parentTaskId ? "Subtask" : "Task"}
        </AdminBreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
}
