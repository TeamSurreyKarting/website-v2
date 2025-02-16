import NewEventForm from "@/components/forms/events/new";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database.types";
import { notFound } from "next/navigation";

async function getMembershipTypes(): Promise<Tables<'MembershipTypes'>[] | null> {
  const supabase = await createClient();

  const now = new Date();

  const { data } = await supabase
    .from("MembershipTypes")
    .select("*");

  return data;
}

export default async function NewEventPage() {
  const membershipTypes = await getMembershipTypes();

  if (!membershipTypes) {
    console.error("No membership types found");
    notFound();
  }

  return (
    <>
      <h2 className={"text-2xl font-bold"}>New Event</h2>
      <NewEventForm membershipTypes={membershipTypes} />
    </>
  )
}