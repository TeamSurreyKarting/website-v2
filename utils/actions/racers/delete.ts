"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteRacer(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Racers")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.log(error);
    throw error;
  }

  revalidatePath(`/racers/${id}`);
  revalidatePath(`/racers`);
  redirect("/racers");
}
