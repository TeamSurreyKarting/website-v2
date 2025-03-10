import { notFound } from "next/navigation";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import clsx from "clsx";
import CompetitionEventDetails from "@/components/competitions/cards/event/details";
import CompetitionEventWeather from "@/components/competitions/cards/event/weather";
import CompetitionEventSquadAvailability from "@/components/competitions/cards/event/squad-availability";
import CompetitionEventTeamSelection from "@/components/competitions/cards/event/team-selection";
import CompetitionEventRaces from "@/components/competitions/cards/event/races";
import { Suspense } from "react";

async function getCompetitionEvent(id: string): Promise<Tables<'CompetitionEvents'> & { Competitions: Tables<'Competitions'>, Events: Tables<'Events'> | null, Tracks: Tables<'Tracks'> }> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionEvents")
      .select('*, Competitions( * ), Events( * ), Tracks( * )')
      .eq("id", id)
      .maybeSingle()
      .throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    notFound();
  }
}

async function getEventTeams(compEventId: string): Promise<(Tables<'CompetitionEventTeams'> & { CompetitionEventTeamSelection: (Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> })[] })[] | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase.from('CompetitionEventTeams')
      .select('*, CompetitionEventTeamSelection( *, Racers( * ) )')
      .eq("event", compEventId)
      .throwOnError();

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getSquad(competitionId: string): Promise<(Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[] | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionSquad")
      .select('*, Racers( * )')
      .eq("competition", competitionId)
      .throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getSquadAvailability(competitionEventId: string): Promise<Tables<'CompetitionEventRacerAvailability'>[] | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionEventRacerAvailability")
      .select('*')
      .eq("competitionEvent", competitionEventId)
      .throwOnError();

    if (!data) {
      throw new Error("Competition id invalid");
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function CompetitionEventPage(props: { params: Promise<{ id?: string, eventId?: string }> }) {
  const params = await props.params;
  const competitionEventId = params.eventId;
  const competitionId = params.id;

  if (!competitionEventId) {
    console.error("No competition event ID supplied.");
    notFound();
  }

  if (!competitionId) {
    console.error("No competition id supplied.");
    notFound();
  }

  const [
    competitionEvent,
    competitionEventTeams,
    competitionSquad,
    competitionSquadAvailability,
  ] = await Promise.all([
    getCompetitionEvent(competitionEventId),
    getEventTeams(competitionEventId),
    getSquad(competitionId),
    getSquadAvailability(competitionEventId),
  ]);

  return (
    <>
      <h2 className={"text-2xl font-bold"}>{competitionEvent.Competitions.name}</h2>
      <h3 className={"text-xl font-medium text-ts-gold-700"}>{competitionEvent.Events?.name}</h3>
      <div className={clsx("mt-4", {
        "flex flex-col lg:grid grid-cols-[2fr_1fr] gap-4": competitionEvent.Tracks.type === "outdoor"
      })}>
        { competitionEvent.Events && <CompetitionEventDetails event={competitionEvent.Events} track={competitionEvent.Tracks} />}
        { competitionEvent.Tracks.type === "outdoor" && (
          <Suspense fallback={<p>Loading...</p>}>
            <CompetitionEventWeather competitionEvent={competitionEvent} track={competitionEvent.Tracks} />
          </Suspense>
        )}
      </div>
      <div className={"mt-4 flex flex-col lg:grid grid-cols-[1fr_2fr] gap-4"}>
        { competitionSquad && competitionSquadAvailability && <CompetitionEventSquadAvailability squad={competitionSquad} availability={competitionSquadAvailability} competitionEventId={competitionEventId} /> }
        { competitionEventTeams && competitionSquad && competitionSquadAvailability && <CompetitionEventTeamSelection competitionEvent={competitionEvent} competitionEventTeams={competitionEventTeams} squad={competitionSquad} squadAvailability={competitionSquadAvailability} /> }
      </div>
      { competitionEventTeams && <CompetitionEventRaces competitionEvent={competitionEvent} competitionTeams={competitionEventTeams} /> }
    </>
  )
}