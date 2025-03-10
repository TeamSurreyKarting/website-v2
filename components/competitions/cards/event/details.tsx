import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { Tables } from "@/database.types";

export default function CompetitionEventDetails({ event, track }: { event: Tables<'Events'>, track: Tables<'Tracks'> }) {
  return (
    <Card>
      <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
        <CardTitle>Event Details</CardTitle>
        <Link href={`/events/${event.id}`}>
          <Button>
            <CalendarRange />
            <span>Manage Event</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent className={"flex flex-col lg:grid grid-cols-3 gap-4"}>
        <Link className={"flex flex-col"} href={`/tracks/${track.id}`}>
          <strong>Track</strong>
          <span>{track.name}</span>
        </Link>
        <div className={"flex flex-col"}>
          <strong>Starts At</strong>
          <span>{format(event.startsAt ?? "", "HH:mm, PPP")}</span>
        </div>
        <div className={"flex flex-col"}>
          <strong>Ends At</strong>
          <span>{format(event.endsAt ?? "", "HH:mm, PPP")}</span>
        </div>
      </CardContent>
    </Card>
  )
}