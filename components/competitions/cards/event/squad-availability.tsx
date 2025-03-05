import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import UpdateSquadAvailability from "@/components/competitions/cards/event/availability/update";
import pluralize from "pluralize";
import { CircleAlert } from "lucide-react";

type CompetitionEventSquadAvailabilityProps = {
  competitionEventId: string,
  squad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[],
  availability: Tables<'CompetitionEventRacerAvailability'>[],
}

export default async function CompetitionEventSquadAvailability({ squad, availability, competitionEventId }: CompetitionEventSquadAvailabilityProps) {
  const unconfirmed = squad.length - availability.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Squad Availability</CardTitle>
        { unconfirmed > 0 && (
          <div className={"flex flex-row gap-2 items-center"}>
            <CircleAlert />
            <CardDescription>{unconfirmed} squad {pluralize("member", unconfirmed)} {pluralize("has", unconfirmed)} not confirmed their availability</CardDescription>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/*<ScrollArea className="md:h-40 w-full">*/}
          {squad.map((squadRacer) => {
            const currentAvailability = availability.find((a) => a.squadRacer === squadRacer.id);
            const isAvailable = currentAvailability ? currentAvailability.isAvailable : undefined;

            return <UpdateSquadAvailability compEventId={competitionEventId} squadRacer={squadRacer} defaultValue={isAvailable} key={squadRacer.id} />
          })}
        {/*</ScrollArea>*/}
      </CardContent>
    </Card>
  )
}