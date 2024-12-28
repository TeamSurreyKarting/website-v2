import {Database} from "@/database.types";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {createClient} from "@/utils/supabase/server";
import TaskCard from "@/components/tasks/kanban-board/task-card";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

async function getAuthedUserId(): Promise<string|undefined> {
	const supabase = await createClient();

	const { data: { user }, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	return user?.id;
}

export default async function TasksKanbanBoard ({ tasks, className, showSubtasks = false }: { tasks: Database['public']['Views']['TaskDetailsView']['Row'][], className?: string, showSubtasks?: boolean }) {
	const groups: { name: Database['public']['Enums']['task_status'], description: string }[] = [
		{ name: "Open", description: "Tasks awaiting initiation. They have been defined and assigned but have not yet begun." },
		{ name: "In Progress", description: "Tasks being actively worked on." },
		{ name: "Blocked", description: "Tasks that have been started but are currently unable to progress." },
		{ name: "Completed", description: "Tasks that have been successfully finished." },
		{ name: "Cancelled", description: "Tasks that have been formally discontinued and will not be pursued further." },
	];

	const authedUserId = await getAuthedUserId();

	return (
		<div
			className={cn(`grid grid-cols-5 gap-4 h-full overflow-x-scroll`, className)}
		>
			{groups.map(group => {
				let groupTasks = tasks.filter((x) => x.status === group.name)

				// only show parent tasks for each group
				if (!showSubtasks) {
					groupTasks = groupTasks.filter((x) => !x.parent_task)
				}

				return (
					<div
						key={group.name}
						className={"rounded-lg bg-ts-blue-600 border border-ts-blue-300 text-white overflow-hidden min-w-[200px]"}
					>
						<div
							className={"bg-ts-blue-400 px-2 py-1 flex items-center justify-between"}>
							<div>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<h3 className={"text-lg font-medium hover:underline"}>{ group.name }</h3>
										</TooltipTrigger>
										<TooltipContent>
											<p>{ group.description }</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<Badge variant="default" className={"bg-ts-blue-200 border border-white"}>{ groupTasks.length }</Badge>
						</div>
						<div
							className={"p-2 flex flex-col gap-2"}
						>
							{groupTasks.map((task) => <TaskCard key={task.id} task={task} authedUserId={authedUserId} />)}
						</div>
					</div>
				)}
			)}
		</div>
	)
}
