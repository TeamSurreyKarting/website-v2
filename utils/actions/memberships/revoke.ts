'use server';

import {createClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function revokeMembership(id: string) {
	const supabase = await createClient();

	const { error } = await supabase.from("Members").delete().eq('id', id).select();

	if (error) {
		console.log(error);
		throw error;
	}

	revalidatePath(`/members/${id}`);
	revalidatePath(`/members`);
	redirect('/members');
}
