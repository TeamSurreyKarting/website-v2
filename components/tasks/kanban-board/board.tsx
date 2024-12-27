import {Database} from "@/database.types";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {createClient} from "@/utils/supabase/server";
import TaskCard from "@/components/tasks/kanban-board/task-card";

async function getAuthedUserId(): Promise<string|undefined> {
	const supabase = await createClient();

	const { data: { user }, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	return user?.id;
}

export default async function TasksKanbanBoard ({ tasks, className, showSubtasks = false }: { tasks: Database['public']['Views']['TaskDetailsView']['Row'][], className?: string, showSubtasks?: boolean }) {
	const groups: Database['public']['Enums']['task_status'][] = [
		"Open",
		"In Progress",
		"Blocked",
		"Completed",
		"Cancelled",
	];

	const authedUserId = await getAuthedUserId();

	return (
		<div
			className={cn(`grid grid-cols-5 gap-4 h-full overflow-x-scroll`, className)}
		>
			{groups.map(group => {
				let groupTasks = tasks.filter((x) => x.status === group)

				// only show parent tasks for each group
				if (!showSubtasks) {
					groupTasks = groupTasks.filter((x) => !x.parent_task)
				}

				return (
					<div
						key={group}
						className={"rounded-lg bg-ts-blue-600 border border-ts-blue-300 text-white overflow-hidden min-w-[200px]"}
					>
						<div
							className={"bg-ts-blue-400 px-2 py-1 flex items-center justify-between"}>
							<h3 className={"text-lg font-medium"}>{group}</h3>
							<Badge variant="default" className={"bg-ts-blue-200 border border-white"}>{groupTasks.length}</Badge>
						</div>
						<div
							className={"p-2 "}
						>
							{groupTasks.map((task) => <TaskCard key={task.id} task={task} authedUserId={authedUserId} />)}
						</div>
					</div>
				)}
			)}
		</div>
	)
}
