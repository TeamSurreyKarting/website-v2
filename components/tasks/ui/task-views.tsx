import TaskViewSwitcher from "@/components/tasks/ui/task-view-switcher";
import { createClient } from "@/utils/supabase/server";
import TasksDataTable from "@/components/tasks/data-table/data-table";
import { ChartViewType, isChartViewType } from "@/utils/types/chart-view-type";
import TasksKanbanBoard from "@/components/tasks/kanban-board/board";
import { notFound } from "next/navigation";
import { getAuthedUserId } from "@/utils/db-fns/auth/get-user-id";
import TaskViewOptions from "@/components/tasks/ui/view-filters";

async function getTasks(query?: string, assignedTo?: string) {
  const supabase = await createClient();

  const dbQuery = supabase.from("TaskDetailsView").select();

  if (query) {
    dbQuery.ilike("title", `%${query}%`);
    dbQuery.ilike("description", `%${query}%`);
  }

  if (assignedTo) {
    dbQuery.eq("primarily_responsible_person_id", assignedTo);
  }

  const { data: tasks, error } = await dbQuery;

  if (error) throw error;

  return tasks;
}

export default async function TaskViews({
  query,
  view,
  assignedTo,
}: {
  query?: string;
  view?: string;
  assignedTo?: string;
}) {
  const tasks = await getTasks(query, assignedTo);

  const authedUserId = await getAuthedUserId();
  if (!authedUserId) {
    notFound();
  }

  const viewType: ChartViewType = isChartViewType(view)
    ? ChartViewType[view]
    : ChartViewType.kanban;

  console.log(viewType);

  return (
    <>
      <div
        className={"hidden md:flex flex-row gap-4 pt-4 pb-2 justify-between"}
      >
        <TaskViewSwitcher
          defaultValue={viewType}
        />
        <TaskViewOptions
          assignedTo={assignedTo}
        />
      </div>
      <TasksKanbanBoard
        tasks={tasks}
        authedUserId={authedUserId}
        className={viewType === ChartViewType.kanban ? "hidden md:grid" : "hidden"}
      />
      <div
        className={viewType === ChartViewType.list ? "block" : "hidden max-md:block"}
      >
        <TasksDataTable tasks={tasks} authedUserId={authedUserId} />
      </div>
    </>
  );
}
