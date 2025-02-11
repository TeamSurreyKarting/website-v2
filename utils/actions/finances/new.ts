"use server";

import { createServiceClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/database.types";

export async function createFinancialAccount(
  name: string,
  startDate: Date,
  endDate: Date,
  startingBalance: number,
): Promise<Database["public"]["Tables"]["Accounts"]["Row"] | null> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("Accounts")
    .insert({
      name: name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startingBalance: startingBalance,
    })
    .select()
    .single();

  if (error) throw error;

  console.log(data);

  revalidatePath(`/finances`);

  return data;
}
