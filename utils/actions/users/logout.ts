"use server"

import {createClient} from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function logoutUser() {
	const supabase = await createClient();

	await supabase.auth.signOut();

	redirect("/");
}
