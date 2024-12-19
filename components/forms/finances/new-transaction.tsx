"use client";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { redirect } from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {createFinancialTransaction} from "@/utils/actions/finances/transactions/new";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";
import CurrencyInput from "react-currency-input-field";

const formSchema = z.object({
	name: z.string({
		required_error: "Transaction name is required",
		invalid_type_error: "Transaction name is invalid",
	}).min(2).max(40),
	value: z.number({
		required_error: "Transaction value is required",
	}).multipleOf(0.01),
})

export default function NewFinancialTransactionForm({ accountId }: { accountId: string }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			value: 0,
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		const tx = await createFinancialTransaction(values.name, values.value, accountId);

		if (tx) {
			redirect(`/finances/${accountId}`)
		} else {
			console.error('null returned when creating transaction');
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
								<Input placeholder={"Enter a descriptive name"} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
					/>
				<FormField
					control={form.control}
					name={"value"}
					render={({field: { onChange, ...rest }}) => {
						return (
							<FormItem>
								<FormLabel>Value</FormLabel>
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
				<LoadingButton className={"bg-ts-blue-700 hover:bg-white hover:text-black float-right"} variant={"outline"} type={"submit"} loading={form.formState.isSubmitting}>Add Transaction</LoadingButton>
			</form>
		</Form>
	);
}
