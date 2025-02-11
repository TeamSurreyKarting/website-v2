"use server";

import { createServiceClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";

export async function editRacer(
  racerId: string,
  firstName?: string,
  lastName?: string,
  graduationDate?: Date,
) {
  const supabase = await createServiceClient();

  // Generate object
  const updateObj: Database["public"]["Tables"]["Racers"]["Update"] = {
    firstName: firstName,
    lastName: lastName,
    graduationDate: graduationDate?.toISOString(),
  };

  const { data, error } = await supabase
    .from("Racers")
    .update(updateObj)
    .eq("id", racerId);

  if (error) {
    throw error;
  }

  if (!data) {
    return false;
  }

  revalidatePath(`/racers`);
  revalidatePath(`/racers/${racerId}`);

  return true;
}
