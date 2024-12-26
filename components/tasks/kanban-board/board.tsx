import {Database} from "@/database.types";
import {cn} from "@/lib/utils";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import {Badge} from "@/components/ui/badge";
import { FaChevronDown, FaChevronUp, FaClock, FaGripLines, FaUsers } from "react-icons/fa6";
import { TbSubtask } from "react-icons/tb";
import { GoCommentDiscussion } from "react-icons/go";
import {Separator} from "@/components/ui/separator";
import {createClient} from "@/utils/supabase/client";

export default function TasksKanbanBoard ({ tasks, className }: { tasks: Database['public']['Tables']['Tasks']['Row'][], className?: string }) {
	const groups: Database['public']['Enums']['task_status'][] = [
		"Open",
		"In Progress",
		"Blocked",
		"Completed",
		"Cancelled",
	];

	const supabase = createClient();

	return (
		<div
			className={cn(`grid grid-cols-5 gap-4 h-full overflow-x-scroll`, className)}
		>
			{groups.map(group => {
				// only show parent tasks for each group
				const groupTasks = tasks.filter((x) => x.status === group && !x.parent_task_id)

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
							className={"p-2"}
						>
							{groupTasks.map((task) => (
								<div
									className={"rounded-md border border-ts-blue-200 overflow-hidden"}
									key={task.id}
								>
									<Link
										href={`/tasks/${task.id}`}
									>
										<div
											className={"bg-ts-blue-400 p-2  hover:bg-ts-gold hover:text-ts-blue flex flex-row items-center justify-between group transition"}
										>
											<h4>{task.title}</h4>
											<LuExternalLink className={"opacity-0 group-hover:opacity-100"}/>
										</div>
									</Link>
									<p className={"p-2 text-white opacity-75"}>{task.description}</p>
									<div className={"m-2 p-2 flex flex-row gap-2 items-center justify-center text-white opacity-75 bg-ts-blue-500 border border-ts-blue-300 rounded-sm w-fit"}>
										<TbSubtask/>
										{/* todo: add subtask count with completed subtask count */}
										<span>0 / 3</span>
									</div>
									<Separator className={"bg-ts-blue-100 mt-2"}/>
									<div
										className={"p-2 flex flex-wrap gap-2 *:rounded-sm *:bg-ts-blue-500 *:border *:border-ts-blue-300 *:p-1 *:px-2 *:text-white *:opacity-75 *:flex *:gap-2 *:items-center *:justify-center *:text-sm"}
									>
										<div>
											{task.priority === "Low" && <FaChevronDown/>}
											{task.priority === "Medium" && <FaGripLines/>}
											{task.priority === "High" && <FaChevronUp/>}
											<span>{task.priority}</span>
										</div>
										{/* todo: add number of participants */}
										<span>
											<FaUsers />
											3
										</span>
										{/* todo: add indicator if authed user is responsible user */}
										{/*	todo: add number of comments with badge for unread comments if user is primarily responsible */}
										<span>
											<GoCommentDiscussion />
											5
										</span>
										<span>
											<FaClock/>
											{new Date(task.due_at).toLocaleString('en-GB')}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			)}
		</div>
	)
}
