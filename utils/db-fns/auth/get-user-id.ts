import { createClient } from "@/utils/supabase/server";

export async function getAuthedUserId(): Promise<string | undefined> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user?.id;
}
