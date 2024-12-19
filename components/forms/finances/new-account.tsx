"use client";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import MonthYearPicker from "@/components/ui/month-year-picker";
import CurrencyInput from "react-currency-input-field";
import { redirect } from "next/navigation";
import {createFinancialAccount} from "@/utils/actions/finances/new";
import {LoadingButton} from "@/components/ui/loading-button";

const formSchema = z.object({
	name: z.string({
		required_error: "Account name is required",
		invalid_type_error: "Account name is invalid",
	}).min(2),
	startDate: z.date({
		required_error: "Start date is required",
		invalid_type_error: "Start date is invalid",
	}),
	endDate: z.date({
		required_error: "End date is required",
		invalid_type_error: "End date is invalid",
	}),
	startingBalance: z.number({
		required_error: "Start balance is required",
	}).multipleOf(0.01),
}).refine(data => data.startDate < data.endDate, {
	message: "End date must be after Start date",
	path: ["endDate"],
});

export function NewFinancialAccountForm() {
	const minYear = new Date().getFullYear() - 2;
	const maxYear = new Date().getFullYear() + 2;

	const minDate = new Date(minYear, 0, 1);
	const maxDate = new Date(maxYear, 0, 1);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			startDate: new Date(),
			endDate: new Date(),
			startingBalance: 0,
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		const account = await createFinancialAccount(values.name, values.startDate, values.endDate, values.startingBalance);

		if (account) {
			redirect(`/finances/${account.id}`)
		} else {
			console.error('null returned from accounts')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
				<FormField
					control={form.control}
					name={"name"}
					render={({field}) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder={"Account Name"} {...field} />
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>
				<div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
					<FormField
						control={form.control}
						name={"startDate"}
						render={({field}) => (
							<FormItem>
								<FormLabel>Start Date</FormLabel>
								<FormControl>
									<MonthYearPicker minDate={minDate} maxDate={maxDate} bypassValidation={true} {...field} />
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"endDate"}
						render={({field}) => (
							<FormItem>
								<FormLabel>End Date</FormLabel>
								<FormControl>
									<MonthYearPicker minDate={minDate} maxDate={maxDate} bypassValidation={true} {...field} />
								</FormControl>
								<FormMessage/>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name={"startingBalance"}
					render={({field: { onChange, ...rest }}) => {
						return (
							<FormItem>
								<FormLabel>Starting Balance</FormLabel>
								<FormDescription>Enter the starting balance for the account or budget.</FormDescription>
								<FormControl>
									<CurrencyInput
										customInput={Input}
										prefix={'£'}
										decimalsLimit={2}
										decimalScale={2}
										intlConfig={{locale: 'en-GB', currency: 'GBP'}}
										onValueChange={(value) => onChange(Number(value))}
										{...rest}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					}
				/>
				<LoadingButton className={"bg-ts-blue-700 hover:bg-white hover:text-black float-right"} variant={"outline"} type={"submit"} loading={form.formState.isSubmitting}>Create Financial Account</LoadingButton>
			</form>
		</Form>
);
}
