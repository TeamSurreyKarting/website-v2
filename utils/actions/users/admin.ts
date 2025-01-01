import { createServiceClient } from "@/utils/supabase/server";

export async function updateUserAdminRights(
  userId: string,
  adminStatus: boolean,
) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      isAdmin: adminStatus,
    },
  });

  return error ? error : data;
}
