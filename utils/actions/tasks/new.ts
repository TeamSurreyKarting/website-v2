"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewTask(
  title: string,
  description: string,
  dueAt: Date,
  status: Database["public"]["Enums"]["task_status"],
  priority: Database["public"]["Enums"]["task_priority"],
  primaryResponsiblePerson: string,
  assignees: string[],
  parentTaskId: string | undefined,
) {
  const supabase = await createClient();

  console.log(parentTaskId);

  // create task
  const { data: taskData, error: taskError } = await supabase
    .from("Tasks")
    .insert({
      title: title,
      description: description,
      due_at: dueAt.toISOString(),
      status: status,
      priority: priority,
      primarily_responsible_person: primaryResponsiblePerson,
      parent_task: parentTaskId ?? null,
    })
    .select()
    .single();

  if (taskError) throw taskError;

  // create task assignees
  const assigneeData: Omit<
    Database["public"]["Tables"]["TaskAssignees"]["Row"],
    "assigned_by" | "assigned_at"
  >[] = assignees.map((assignee) => {
    return { task: taskData.id, assigned_to: assignee };
  });
  const { error: taskAssigneesError } = await supabase
    .from("TaskAssignees")
    .insert(assigneeData);

  if (taskAssigneesError) throw taskAssigneesError;

  revalidatePath(`/tasks`);
  revalidatePath(`/tasks/${taskData.id}`);

  if (parentTaskId) {
    revalidatePath(`/tasks/${parentTaskId}`);
  }

  redirect(`/tasks/${taskData.id}`);
}
