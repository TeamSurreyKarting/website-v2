import { notFound } from "next/navigation";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarRange, Plus } from "lucide-react";
import { FaRedo } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";

async function getCompetitionEvent(id: string): Promise<(Tables<'CompetitionEvents'> & { Competitions: Tables<'Competitions'>, Events: Tables<'Events'> | null })> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("CompetitionEvents")
      .select('*, Competitions( * ), Events( * )')
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

export default async function CompetitionEventPage(props: { params: Promise<{ eventId?: string }> }) {
  const params = await props.params;
  const competitionEventId = params.eventId;

  if (!competitionEventId) {
    console.error("No competition event ID supplied.");
    notFound();
  }

  const competitionEvent = await getCompetitionEvent(competitionEventId);

  return (
    <>
      <h2 className={"text-2xl font-bold"}>{competitionEvent.Competitions.name}</h2>
      <h3 className={"text-xl font-medium text-ts-gold-700"}>{competitionEvent.Events?.name}</h3>
      <div className={"mt-4 flex flex-col lg:grid grid-cols-[2fr_1fr] gap-4"}>
        <Card>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Event Details</CardTitle>
            <Link href={`/events/${competitionEvent.Events!.id}`}>
              <Button>
                <CalendarRange />
                <span>Manage Event</span>
              </Button>
            </Link>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Weather Forecast</CardTitle>
            <Button
              variant={"outline"}
            >
              <FaRedo />
            </Button>
          </CardHeader>
        </Card>
      </div>
      <div className={"mt-4 flex flex-col lg:grid grid-cols-[1fr_2fr] gap-4"}>
        <Card>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Squad Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[0.63vh] w-full">
              {/* Put all squad racers in here, set their availability to ? (unknown) */}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
            <CardTitle>Teams</CardTitle>
            {/* Put teams in carousel with + button as last el in list */}
          </CardHeader>
        </Card>
      </div>
      <Card className={"mt-4"}>
        <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
          <CardTitle>Races</CardTitle>
        </CardHeader>
      </Card>
    </>
  )
}