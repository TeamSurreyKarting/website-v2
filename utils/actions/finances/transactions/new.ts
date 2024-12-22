'use server';

import {createServiceClient} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {Database} from "@/database.types";

export async function createFinancialTransaction(name: string, value: number, accountId: string): Promise<Database['public']['Tables']['Transactions']['Row'] | null> {
	const supabase = await createServiceClient();

	const { data, error } = await supabase.from("Transactions").insert({
		itemDescription: name,
		value: value,
		account: accountId,
	}).select().single();

	if (error) throw error;

	console.log(data);

	revalidatePath(`/finances/${accountId}`);

	return data;
}
