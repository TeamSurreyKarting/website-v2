import { notFound } from "next/navigation";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

async function getCompetition(id: string): Promise<Tables<'Competitions'>> {
  try {
    const supabase = await createClient();

    const { data } = await supabase.from("Competitions").select().eq("id", id).maybeSingle().throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

export default async function CompetitionsDetailPage(props: { params: Promise<{ id?: string }> }) {
  const params = await props.params;
  const competitionId = params.id;

  if (!competitionId) {
    console.error("No competition id supplied.");
    notFound();
  }

  try {
    const competition = await getCompetition(competitionId)

    return (
      <div className={"container mx-auto"}>
        <h2 className={"text-2xl font-bold"}>Competition</h2>
        <h3 className={"text-xl font-medium text-ts-gold-700"}>{competition.name}</h3>
      </div>
    )
  } catch (e) {
    console.error(e);
  }
}