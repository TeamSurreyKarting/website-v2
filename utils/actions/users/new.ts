"use server";

import { createServiceClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  isAdmin: boolean = false,
) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true,
    password: "",
    user_metadata: {
      firstName: firstName,
      lastName: lastName,
    },
    app_metadata: {
      isAdmin: isAdmin,
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }
  revalidatePath(`/racers`);

  return data.user;
}
