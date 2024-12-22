import {createClient} from "@/utils/supabase/server";
import clsx from "clsx";

async function getAccountDetails(account: string) {
	const supabase = await createClient();

	const { data: accountDetails, error } = await supabase.from('Accounts').select().eq('id', account).single();

	if (error) {
		throw error;
	}

	return accountDetails;
}

export default async function AccountDetails({ account, className }: { account: string, className?: string }) {
	const details = await getAccountDetails(account);

	const gbpFormat = Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return (
		<div className={clsx("py-4 grid grid-rows-[2fr_1fr] md:grid-cols-[2fr_1fr] gap-4", className)}>
			<div className={"rounded-md bg-ts-blue-600 border-ts-blue-500 border"}>
				{/*	chart of transaction history affecting balance goes here */}
			</div>
			<div className={"flex flex-col gap-2"}>
				<div className={"flex flex-col gap-2 items-center rounded-md bg-ts-blue-600 border-ts-blue-500 border p-2"}>
					<span className={"text-2xl font-bold my-4"}>{gbpFormat.format(details.endingBalance)}</span>
					<span className={"opacity-60"}>Left To Spend</span>
				</div>
				<div className={"flex flex-col gap-2 items-center rounded-md bg-ts-blue-600 border-ts-blue-500 border p-2"}>
					<span className={"text-2xl font-bold my-4"}>{gbpFormat.format(details.startingBalance)}</span>
					<span className={"opacity-60"}>Budget Allocated</span>
				</div>
			</div>
		</div>
	);
}
