'use client';

import {Button} from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import {FaXmark} from "react-icons/fa6";
import {MutableRefObject, useRef, useState} from "react";
import {Database} from "@/database.types";
import {clsx} from "clsx";
import {Spinner} from "@/components/ui/spinner";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MonthYearPicker from "@/components/ui/month-year-picker";
import {editUser} from "@/utils/actions/users/edit";
import {editRacer} from "@/utils/actions/racers/edit";
import {revalidatePath} from "next/cache";

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
	graduationDate: z.date().min(new Date('2013-01-01'))
})

export default function RacerDetails( {details}: {details: Database['public']['Views']['RacerDetails']['Row']}) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [changesMade, setChangesMade] = useState(true);

	const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: details.email!,
			firstName: details.firstName!,
			lastName: details.lastName!,
			graduationDate: new Date(details.graduationDate!),
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// No need to submit form if no changes made
		if (!changesMade) return;

		setIsSaving(true);

		const userEdit = editUser(details.id!, values.email, values.firstName, values.lastName);
		const racerEdit = editRacer(details.id!, values.firstName, values.lastName, values.graduationDate);

		console.log('requesting')
		const [userEditResult, racerEditResult] = await Promise.allSettled([
			userEdit,
			racerEdit,
		])
		console.log('results', userEditResult, racerEditResult);

		setIsEditing(false);
		setIsSaving(false);

		revalidatePath(`/racers/${details.id!}`)
	}

	function handleCancel(){
		// reload component
		setIsEditing(false);
		revalidatePath(`/racers/${details.id!}`)
	}

	return (
		<div className={clsx("transition-colors my-6 rounded-lg bg-ts-blue-600 border-ts-blue-400 w-full border p-4", {
			'border-ts-gold-800 bg-ts-blue-400' : isEditing,
		})}>
			<div className={"h-10 flex gap-2 justify-between items-center"}>
				<h4 className={"font-medium text-xl"}>Details</h4>
				<Button
					variant={"outline"}
					className={clsx("bg-ts-blue-400", {
						'hidden': isEditing,
					})}
					onClick={() => setIsEditing(true)}
					disabled={isSaving}
				>
					<MdEdit />
					Edit
				</Button>
				<Spinner show={isSaving} />
			</div>
			<Form {...form}>
				<form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4 mt-2"}>
					<div
						className={"grid grid-cols-1 gap-2 md:grid-cols-2"}
					>
						<FormField
							control={form.control}
							name={"firstName"}
							data-initialData={details.firstName}
							disabled={!isEditing || isSaving}
							render={({field}) => (
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
							data-initialData={details.lastName}
							disabled={!isEditing || isSaving}
							render={({field}) => (
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
						data-initialData={details.email}
						disabled={!isEditing || isSaving}
						render={({field}) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder={"Email"} {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<div>
						<FormField
							disabled={!isEditing || isSaving}
							control={form.control}
							name={"graduationDate"}
							render={({field}) => (
								<FormItem>
									<FormLabel>Graduation Date</FormLabel>
									<FormControl>
										<MonthYearPicker {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

					</div>
					<div
						className={"h-10 flex gap-2"}
					>
						<Button
							variant={"outline"}
							className={clsx("bg-ts-blue-400", {
								'hidden': !isEditing,
							})}
							onClick={() => handleCancel()}
							disabled={isSaving}
						>
							<FaXmark />
							Cancel
						</Button>
						<Button
							variant={"secondary"}
							className={clsx("xs:w-full md:w-fit bg-white text-black", {
								'hidden': !isEditing,
							})}
							type={"submit"}
							disabled={isSaving}
							>
							<FaSave />
							{isSaving ? "Saving" : "Save"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
