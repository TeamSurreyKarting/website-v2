import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import RacerDetails from "@/components/racers/profile/racer-details";
import RacerMembershipList from "@/components/racers/profile/racer-membership-list";
import { notFound } from "next/navigation";
import { MembershipNested } from "@/utils/types/membership-nested";

async function getRacerDetails(
  id: string,
): Promise<Tables<"RacerDetails">> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("RacerDetails")
      .select()
      .eq("id", id)
      .single()
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

async function getRacerMemberships(id: string): Promise<MembershipNested[]> {
  try {
    const supabase = await createClient();

    const query = supabase
      .from("Members")
      .select(
        "id, addedAt, addedBy, MembershipTypes!inner( id, name, validFrom, validUntil ), Racers!inner( id, fullName )",
      )
      .eq("racer", id);

    const { data } = await query;

    return data?.map((m) => {
      return {
        id: m.id,
        addedAt: m.addedAt,
        addedBy: m.addedBy,
        MembershipTypes: {
          id: m.MembershipTypes.id,
          name: m.MembershipTypes.name,
          validFrom: new Date(m.MembershipTypes.validFrom),
          validUntil: new Date(m.MembershipTypes.validUntil),
        },
        Racers: {
          id: m.Racers.id,
          fullName: m.Racers.fullName,
        },
      };
    }) ?? [];
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function Page(props: { params: Promise<{ id?: string }> }) {
  const params = await props.params;
  const racerId = params.id;

  if (!racerId) {
    console.error("Racer not found in database.")
    notFound();
  }

  const [racerProfile, racerMemberships] = await Promise.all([
    getRacerDetails(racerId),
    getRacerMemberships(racerId),
  ]);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Racer Profile</h2>
      <h3 className={"text-xl font-medium text-ts-gold-700"}>
        {racerProfile.fullName}
      </h3>
      <div className="flex flex-col gap-2 mt-4">
        <RacerDetails details={racerProfile} />
        <RacerMembershipList racerDetails={racerProfile} memberships={racerMemberships} />
      </div>
    </div>
  );
}
