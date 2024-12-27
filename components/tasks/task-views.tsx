import TaskViewSwitcher from "@/components/tasks/task-view-switcher";
import {createClient} from "@/utils/supabase/server";
import TasksDataTable from "@/components/tasks/data-table/data-table";
import clsx from "clsx";
import {ChartViewType, isChartViewType} from "@/utils/types/chart-view-type";
import TasksKanbanBoard from "@/components/tasks/kanban-board/board";

async function getTasks(query?: string) {
	const supabase = await createClient();

	const dbQuery = supabase
		.from("TaskDetailsView")
		.select();

	if (query) {
		dbQuery.like("title", `%${query}%`);

		// todo: include filtering by description
		// dbQuery.like("description", `%${query}%`);
	}

	const { data: tasks, error } = await dbQuery;

	if (error) throw error;

	return tasks;
}

export default async function TaskViews({ query, view }: { query?: string, view?: string, }) {
	const tasks = await getTasks(query);

	const viewType: ChartViewType = isChartViewType(view) ? ChartViewType[view] : ChartViewType.kanban;

	return (
		<>
			<TaskViewSwitcher defaultValue={viewType} />
			<TasksKanbanBoard
				tasks={tasks}
				className={clsx({
					"grid": view === ChartViewType.kanban,
					"hidden": view !== ChartViewType.kanban,
				})}
			/>
			<div className={clsx({
				"block": view === ChartViewType.list,
				"hidden": view !== ChartViewType.list,
			})}>
				<TasksDataTable tasks={tasks} />
			</div>
		</>
	);
}
