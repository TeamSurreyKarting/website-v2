"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {generateYearsBetween} from "@/lib/years-between";
import {LoadingButton} from "@/components/ui/loading-button";
import {useState} from "react";
import {redirect} from "next/navigation";
import {createUser} from "@/utils/actions/users/new";
import {createRacer} from "@/utils/actions/racers/new";

const formSchema = z.object({
	email: z.string({
		required_error: "Email is required",
		invalid_type_error: "Email is invalid",
	}).email(),
	firstName: z.string({
		required_error: "First name is required",
	}).min(2),
	lastName: z.string({
		required_error: "Last name is required",
	}).min(2),
	graduationYear: z.string().transform((x) => parseInt(x)),
	graduationMonth: z.enum(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],),
	isAdministrator: z.boolean().default(false),
})

export function NewRacerForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			graduationYear: new Date().getFullYear(),
			graduationMonth: "August",
			isAdministrator: false,
		}
	});

	const [formIsSubmitting, setFormSubmitting] = useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setFormSubmitting(true);

		// Create user account
		const userId = await createUser(values.email, values.firstName, values.lastName, values.isAdministrator);

		// Determine graduation date
		const graduationTimestamp = Date.parse(`01 ${values.graduationMonth} ${values.graduationYear} GMT`);
		const graduationDate = new Date(graduationTimestamp);

		// Create racer profile
		const _ = await createRacer(userId, values.firstName, values.lastName, graduationDate);

		setFormSubmitting(false);

		// Redirect to racers list on success
		redirect('/racers');
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
				<div
					className={"grid grid-cols-1 gap-2 md:grid-cols-2"}
				>
					<FormField
						control={form.control}
						name={"firstName"}
						render={ ({field}) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder={"First Name"} {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"lastName"}
						render={ ({field}) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder={"Last Name"} {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name={"email"}
					render={ ({field}) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder={"Email"} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<div>
					<FormLabel>Graduation Date</FormLabel>
					<div className={"grid grid-cols-2 gap-2"}>
						<FormField
							control={form.control}
							name={"graduationMonth"}
							render={ ({field}) => (
								<FormItem>
									<FormLabel className={"font-normal"}>Month</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select month" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className={"bg-white"}>
											<SelectItem value={"January"}>January</SelectItem>
											<SelectItem value={"February"}>February</SelectItem>
											<SelectItem value={"March"}>March</SelectItem>
											<SelectItem value={"April"}>April</SelectItem>
											<SelectItem value={"May"}>May</SelectItem>
											<SelectItem value={"June"}>June</SelectItem>
											<SelectItem value={"July"}>July</SelectItem>
											<SelectItem value={"August"}>August</SelectItem>
											<SelectItem value={"September"}>September</SelectItem>
											<SelectItem value={"October"}>October</SelectItem>
											<SelectItem value={"November"}>November</SelectItem>
											<SelectItem value={"December"}>December</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={"graduationYear"}
							render={ ({field}) => (
								<FormItem>
									<FormLabel className={"font-normal"}>Year</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={`${field.value}`}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select year" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className={"bg-white"}>
											{generateYearsBetween(2013, new Date().getFullYear() + 10).map((year) => (
												<SelectItem key={year} value={`${year}`}>{year}</SelectItem>
											))}
										</SelectContent>
										<FormMessage />
									</Select>
								</FormItem>
							)}
						/>
					</div>
				</div>
				<FormField
					control={form.control}
					name={"isAdministrator"}
					render={ ({field}) => (
						<FormItem className="flex flex-row gap-0.5 items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<FormLabel>
									Grant Administrator Privileges
								</FormLabel>
								<FormDescription className={"text-ts-gold-100"}>
									Providing a user with administrator privileges grants
									them access and permissions to view, edit, update and delete
									data within the administration area.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton className={"bg-ts-blue-700 float-right"} variant={"outline"} type="submit" loading={formIsSubmitting}>Create Racer</LoadingButton>
			</form>
		</Form>
	);
}
