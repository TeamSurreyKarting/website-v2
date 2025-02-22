import { AssignMembershipForm } from "@/components/forms/memberships/assign";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/client";

export default async function NewMemberPage(props: {
  searchParams?: Promise<{
    racer?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const racerId = searchParams?.racer ?? null;

  const now = new Date().toISOString();
  async function getMembershipTypes(): Promise<
    Database["public"]["Tables"]["MembershipTypes"]["Row"][]
  > {
    const supabase = await createClient();

    const query = supabase
      .from("MembershipTypes")
      .select()
      .lt("validFrom", now)
      .gt("validUntil", now);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data === null) {
      throw Error("Could not get membership types");
    }

    return data;
  }

  async function getRacers(): Promise<
    Database["public"]["Tables"]["Racers"]["Row"][]
  > {
    const supabase = await createClient();

    const query = supabase.from("Racers").select();

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data === null) {
      throw Error("Could not get racers");
    }

    return data;
  }

  const [membershipTypes, racers] = await Promise.all([
    getMembershipTypes(),
    getRacers(),
  ]);

  const defaultRacerInFetchedRacers = racers.filter((x) => x.id === racerId);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Assign Membership</h2>
      <AssignMembershipForm
        memberships={membershipTypes}
        racers={racers}
        defaultRacer={
          defaultRacerInFetchedRacers.length
            ? defaultRacerInFetchedRacers[0].id
            : null
        }
      />
    </div>
  );
}
