"use server";

import { createServiceClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMembershipType(
  name: string,
  validFrom: Date,
  validTo: Date,
  price: number,
) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase.from("MembershipTypes").insert({
    name: name,
    validFrom: validFrom.toISOString(),
    validUntil: validTo.toISOString(),
    price: price,
  });

  if (error) {
    throw error;
  }

  revalidatePath(`/members/memberships`);

  return data;
}
