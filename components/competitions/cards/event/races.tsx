import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import CompetitionEventRaceCard from "@/components/competitions/cards/event/event-race";
import NewRaceEventForm from "@/components/forms/competitions/races/upsert";

type RaceDetails = Tables<'CompetitionEventRaces'> & {
  CompetitionEventRaceEntrants: (Tables<'CompetitionEventRaceEntrants'> & {
    CompetitionEventTeamSelection: {
      id: string,
      CompetitionEventTeams: Tables<'CompetitionEventTeams'>,
      Racers: Tables<'Racers'>
    }
  })[]
}

async function getRaces(competitionEventId: string): Promise<RaceDetails[] | null> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionEventRaces")
      .select("*, CompetitionEventRaceEntrants( *, CompetitionEventTeamSelection( id, CompetitionEventTeams( * ), Racers( * ) ) )")
      .eq("event", competitionEventId)
      .throwOnError();

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

type CompetitionEventRacesProps = {
  competitionEvent: (Tables<'CompetitionEvents'> & { Events: Tables<'Events'> | null })
  competitionTeams: (Tables<'CompetitionEventTeams'> & { CompetitionEventTeamSelection: (Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> })[] })[]
}

export default async function CompetitionEventRaces({ competitionEvent, competitionTeams }: CompetitionEventRacesProps) {
  const races = await getRaces(competitionEvent.id);

  return (
    <Card className={"mt-4"}>
      <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
        <CardTitle>Races</CardTitle>
        <NewRaceEventForm competitionEvent={competitionEvent} />
      </CardHeader>
      <CardContent>
        {races?.map((race) => <CompetitionEventRaceCard key={race.id} competitionEvent={competitionEvent} race={race} competitionTeams={competitionTeams} />)}
      </CardContent>
    </Card>
  )
}

