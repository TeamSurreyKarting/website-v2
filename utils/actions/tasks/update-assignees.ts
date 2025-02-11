"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function updatePrp(taskId: string, primaryResponsiblePerson: string) {
  const supabase = await createClient();

  const { error: prpError } = await supabase
	.from("Tasks")
	.update({
	  primarily_responsible_person: primaryResponsiblePerson,
	})
	.eq("id", taskId);

  if (prpError) {
	throw prpError;
  }
}

async function handleTaskAssigneeUpdate(taskId: string, newAssignees: string[]) {
  const supabase = await createClient();

  // first, obtain the current list of assignees
  const { data: assignees, error: assigneesFetchError } = await supabase
	.from("TaskAssignees")
	.select("assigned_to")
	.eq("task", taskId);

  if (assigneesFetchError) throw assigneesFetchError;
  const assigneeIds = assignees.map((x) => x.assigned_to);

  // now, determine and remove deleted assignees
  const assigneesRemoved = assigneeIds.filter((x) => !newAssignees.includes(x));
  const { error: assigneesRemoveError } = await supabase
  	.from("TaskAssignees")
	.delete()
	.eq("task", taskId)
	.in('assigned_to', assigneesRemoved);

  if (assigneesRemoveError) throw assigneesRemoveError;

  // second, upsert the new assignees
  const { error: assigneesUpsertError } = await supabase
  	.from("TaskAssignees")
	.upsert(newAssignees.map((x) => { return {task: taskId, assigned_to: x} }))

  if (assigneesUpsertError) throw assigneesUpsertError;
}

export async function updateAssignees(
  taskId: string,
  primaryResponsiblePerson: string,
  assignees: string[]
) {
  await Promise.all([
	updatePrp(taskId, primaryResponsiblePerson),
	handleTaskAssigneeUpdate(taskId, assignees),
  ])

  revalidatePath(`/tasks/${taskId}`);
}