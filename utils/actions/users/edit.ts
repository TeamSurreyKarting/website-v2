'use server';

import {createServiceClient} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function editUser(userId: string, email?: string, firstName?: string, lastName?: string) {
    const supabase = await createServiceClient();

    const updateBody: {
        email: string | undefined,
        user_metadata: {
            first_name: string | undefined,
            last_name: string | undefined,
        }
    } = {
        email: email,
        user_metadata: {
            first_name: firstName,
            last_name: lastName,
        }
    };

    const { data, error } = await supabase.auth.admin.updateUserById(userId, updateBody);

    if (error) {
        throw error;
    }

    if (!data) {
        return false;
    }

    revalidatePath(`/racers`);
    revalidatePath(`/racers/${userId}`);

    return data;
}
