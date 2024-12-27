"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {
	SquareKanbanIcon,
	SquareGanttChartIcon,
	ListChecksIcon
} from 'lucide-react';
import {usePathname, useRouter, useSearchParams } from "next/navigation";
import {ChartViewType} from "@/utils/types/chart-view-type";

export default function TaskViewSwitcher({ defaultValue, onUpdate }: { defaultValue?: ChartViewType, onUpdate?: (value: ChartViewType) => void }) {
	const [currentValue, setValue] = useState<ChartViewType>(defaultValue ?? ChartViewType.kanban);
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	useEffect(() => {
		const params = new URLSearchParams(searchParams);

		params.set("view", currentValue.toString());

		replace(`${pathname}?${params.toString()}`);
	}, [currentValue]);

	return (
		<TooltipProvider>
			<div className="flex gap-2 pt-4 pb-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className={clsx("bg-ts-blue text-white hover:bg-ts-blue-400 hover:text-white", {
								"bg-ts-gold text-black": currentValue === ChartViewType.kanban
							})}
							onClick={() => {setValue(ChartViewType.kanban); onUpdate?.(ChartViewType.kanban)}}>
							<SquareKanbanIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Kanban View</p>
					</TooltipContent>
				</Tooltip>

				{/* FIXME: Gantt chart type requires defining a start date in data model */}
				{/*<Tooltip>*/}
				{/*	<TooltipTrigger asChild>*/}
				{/*		<Button*/}
				{/*			className={clsx("bg-ts-blue text-white hover:bg-ts-blue-400 hover:text-white", {*/}
				{/*				"bg-ts-gold text-black": currentValue === ChartViewType.Gantt*/}
				{/*			})}*/}
				{/*			onClick={() => {setValue(ChartViewType.Gantt); onUpdate?.(ChartViewType.Gantt)}}>*/}
				{/*			<SquareGanttChartIcon />*/}
				{/*		</Button>*/}
				{/*	</TooltipTrigger>*/}
				{/*	<TooltipContent>*/}
				{/*		<p>Gantt View</p>*/}
				{/*	</TooltipContent>*/}
				{/*</Tooltip>*/}

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className={clsx("bg-ts-blue text-white hover:bg-ts-blue-400 hover:text-white", {
								"bg-ts-gold text-black": currentValue === ChartViewType.list
							})}
							onClick={() => {setValue(ChartViewType.list); onUpdate?.(ChartViewType.list)}}>
							<ListChecksIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>List View</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	)
}
