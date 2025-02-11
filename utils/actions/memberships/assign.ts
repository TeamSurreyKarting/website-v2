"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function racerHasMembership(
  racer: string,
  membership: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Members")
    .select("*")
    .eq("racer", racer)
    .eq("membership", membership)
    .limit(1);

  console.log("data", data);
  console.log("error", error);

  if (error) {
    console.error(error);
    throw error;
  }

  const hasMembership = (data !== null && data.length > 0);

  console.log("hasMembership", hasMembership);

  return hasMembership;
}

export async function assignMembershipToUser(
  membership: string,
  racer: string,
) {
  const supabase = await createClient();

  // obtain current session's user id
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if no id, prevent action
  if (!user) {
    throw new Error(
      "Only authenticated users with an active session can perform this action",
    );
  }

  // if racer is current user, prevent
  if (user.id === racer) {
    throw new Error(
      "You cannot set memberships for yourself. Get someone else to perform this action.",
    );
  }

  // check user does not already have membership
  const membershipAlreadyAssigned = await racerHasMembership(racer, membership);

  if (membershipAlreadyAssigned) {
    throw new Error("This racer already has this membership type.");
  }

  const { error } = await supabase
    .from("Members")
    .insert({
      membership: membership,
      racer: racer,
    });

  if (error) {
    console.log(error);
    throw error;
  }

  revalidatePath("/members");
  redirect("/members");
}
