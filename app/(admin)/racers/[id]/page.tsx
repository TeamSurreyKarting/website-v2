import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import RacerDetails from "@/components/racers/profile/racer-details";
import RacerMembershipList from "@/components/racers/profile/racer-membership-list";
import { notFound } from "next/navigation";

async function getRacerDetails(
  id: string,
): Promise<Database["public"]["Views"]["RacerDetails"]["Row"] | null> {
  const supabase = await createClient();

  const { data: racer, error } = await supabase
    .from("RacerDetails")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return racer;
}

export default async function Page(props: { params: Promise<{ id?: string }> }) {
  const params = await props.params;
  const racerId = params.id;

  if (!racerId) {
    console.error("Racer not found in database.")
    notFound();
  }

  const racerProfile = await getRacerDetails(racerId);

  if (!racerProfile) {
    notFound();
  }

  return (
    <>
      <h2 className={"text-2xl font-bold"}>Racer Profile</h2>
      <h3 className={"text-xl font-medium text-ts-gold-700"}>
        {racerProfile.fullName}
      </h3>
      <div className="flex flex-col gap-2 mt-4">
        <RacerDetails details={racerProfile} />
        <RacerMembershipList racerDetails={racerProfile} />
      </div>
    </>
  );
}
