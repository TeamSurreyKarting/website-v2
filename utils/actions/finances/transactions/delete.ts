'use server';

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function deleteTransaction(id: string) {
	const supabase = await createClient();

	const { data, error } = await supabase.from("Transactions").delete().eq('id', id).select().single();

	if (error) {
		console.log(error);
		throw error;
	}

	const accountId = data.account;

	revalidatePath(`/finances/${accountId}`);
	redirect(`/finances/${accountId}`);
}
