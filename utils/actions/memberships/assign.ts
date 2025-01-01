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
    .select("id")
    .eq("racer", racer)
    .eq("membership", membership)
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  return data !== null;
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

  const { error } = await supabase.from("Members").insert({
    // addedBy: user.id,
    addedBy: "12d5d516-962c-420c-8256-cad436362236",
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
