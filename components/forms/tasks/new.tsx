"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import { format } from "date-fns"
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {TimePicker} from "@/components/ui/date-time-picker";
import RacerCombobox from "@/components/racers/combobox";
import RacerMultiSelect from "@/components/racers/multi-select";
import {createNewTask} from "@/utils/actions/tasks/new";

const formSchema = z.object({
	title: z.string({
		required_error: "Title is required",
		invalid_type_error: "Title is invalid",
	}).min(3),
	description: z.string({
		required_error: "Description is required",
	}).min(3),
	dueAt: z.date().min(new Date()),
	status: z.enum(["Open", "In Progress", "Blocked", "Completed", "Cancelled"]).default("Open"),
	priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
	primaryResponsiblePerson: z.string({
		required_error: "Primary Responsible Person is required",
	}).uuid(),
	assignees: z.string().array().nonempty(),
});

export function NewTaskForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			dueAt: new Date(),
			status: "Open",
			priority: "Medium",
			primaryResponsiblePerson: "",
			assignees: [],
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { title, description, dueAt, status, priority, primaryResponsiblePerson, assignees } = values;
		const dueAtDate = new Date(dueAt);

		await createNewTask(title, description, dueAt, status, priority, primaryResponsiblePerson, assignees);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
				<FormField
					control={form.control}
					name={"title"}
					render={ ({field}) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder={"Title"} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"description"}
					render={ ({field}) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Provide a description of the task"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"dueAt"}
					render={ ({field}) => (
						<FormItem className="flex flex-col">
							<FormLabel>Due Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													"bg-ts-blue-600",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													format(field.value, "HH:mm PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											className={"bg-ts-blue-500 text-white"}
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date <= new Date()
											}
											initialFocus
										/>
										<div>
											<TimePicker
												className={"bg-ts-blue-500 text-white"}
												date={field.value}
												setDate={field.onChange}
											/>
										</div>
									</PopoverContent>
								</Popover>
						</FormItem>
					)}
				/>
				<div className={"grid grid-cols-1 md:grid-cols-2 gap-3"}>
					<FormField
						control={form.control}
						name={"status"}
						render={ ({field}) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a status..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Open">Open</SelectItem>
										<SelectItem value="In Progress">In Progress</SelectItem>
										<SelectItem value="Blocked">Blocked</SelectItem>
										<SelectItem value="Completed">Completed</SelectItem>
										<SelectItem value="Cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"priority"}
						render={ ({field}) => (
							<FormItem>
								<FormLabel>Priority</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a priority..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Low">Low</SelectItem>
										<SelectItem value="Medium">Medium</SelectItem>
										<SelectItem value="High">High</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name={"primaryResponsiblePerson"}
					render={ ({field}) => (
						<FormItem className={"flex flex-col"}>
							<FormLabel>Primary Responsible Person</FormLabel>
							<RacerCombobox defaultValue={field.value} onValueChange={field.onChange} />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={"assignees"}
					render={ ({field}) => (
						<FormItem className={"flex flex-col"}>
							<FormLabel>Assignees</FormLabel>
							<FormControl>
								<RacerMultiSelect defaultValue={field.value} onValueChange={field.onChange} />
							</FormControl>
							<FormDescription>
								All people responsible for the completion of this task.
							</FormDescription>
						</FormItem>
					)}
				/>
				<LoadingButton className={"bg-ts-blue-700 hover:bg-white hover:text-black float-right"} variant={"outline"} type={"submit"} loading={form.formState.isSubmitting}>Add Task</LoadingButton>
			</form>
		</Form>
	)
}
