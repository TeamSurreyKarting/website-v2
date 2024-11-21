'use server';

import {createServiceClient} from "@/utils/supabase/server";
import {revalidatePath} from "next/cache";

export async function createRacer(userId: string, firstName: string, lastName: string, graduationDate: Date) {
	const supabase = await createServiceClient();

	const { data, error } = await supabase.from("Racers").insert({
		id: userId,
		firstName: firstName,
		lastName: lastName,
		graduationDate: graduationDate,
	});

	if (error) {
		throw error;
	}

	if (!data) {
		return false;
	}

	revalidatePath(`/racers`);
	revalidatePath(`/racers/${userId}`);

	return true;
}
