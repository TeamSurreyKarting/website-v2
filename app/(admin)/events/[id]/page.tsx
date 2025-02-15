import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import ChecklistCard from "@/components/events/card/checklist";
import TicketsCard from "@/components/events/card/tickets";
import TicketHoldersCard from "@/components/events/card/ticket-holders";
import ScheduleCard from "@/components/events/card/schedule";

type Event = Tables<'Events'> & {
  EventChecklist: (Tables<'EventChecklist'> & { Racers: Tables<'Racers'> })[],
  EventSchedule: Tables<'EventSchedule'>[],
  EventTicket: (Tables<'EventTicket'> & { EventTicketAllocation: (Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn: Tables<'EventTicketAllocationCheckIn'> })[] })[],
  EventTransport: (Tables<'EventTransport'> & { EventTransportAllocation: Tables<'EventTransportAllocation'>[] })[]
}

async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Events")
    .select("*, EventChecklist( *, Racers( * )), EventSchedule( * ), EventTicket( *, EventTicketAllocation( *, Racers!EventTicketAllocation_racer_fkey( * ), EventTicketAllocationCheckIn( * ) )), EventTransport( *, EventTransportAllocation( * ))")
    .eq("id", id)
    .maybeSingle()
    .throwOnError();

  return data;
}

async function getRacers(): Promise<Tables<'Racers'>[] | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Racers")
    .select()
    .throwOnError();

  return data;
}

async function getMembershipTypes(): Promise<Tables<'MembershipTypes'>[] | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("MembershipTypes")
    .select()
    .throwOnError();

  return data;
}

export default async function EventPage({ params }: { params?: Promise<{ id: string }>}) {
  try {
    const id = (await params)?.id;

    if (!id) {
      console.error("missing id param for event")
      notFound();
    }

    const [
      event,
      racers,
      membershipTypes,
    ] = await Promise.all([
      getEvent(id),
      getRacers(),
      getMembershipTypes(),
    ]);

    if (!event) {
      console.error("missing event data for event from db")
      notFound();
    }

    if (!racers) {
      console.error("missing racers for event");
      notFound();
    }

    if (!membershipTypes) {
      console.error("missing membershipTypes for event");
      notFound();
    }

    return (
      <>
        <h2 className={"text-2xl font-bold"}>Event</h2>
        <h3 className={"text-xl font-medium text-ts-gold-700"}>
          {event.name}
        </h3>
        <Card className={"mt-4 bg-ts-blue"}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4"}>
            <div className={"flex flex-col gap-1"}>
              <span className={"font-medium"}>Starts At</span>
              <span>{format(event?.startsAt, 'PPP HH:mm')}</span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className={"font-medium"}>Ends At</span>
              <span>{format(event?.endsAt, 'PPP HH:mm')}</span>
            </div>
            <div className={"flex flex-col gap-1"}>
              <span className={"font-medium"}>Description</span>
              {event?.description ? (<span>{event.description}</span>) : (<em>No description</em>) }
            </div>
          </CardContent>
        </Card>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-2 my-2"}>
          {event?.EventSchedule && <ScheduleCard schedule={event?.EventSchedule} eventId={event.id} />}
          {event?.EventChecklist && <ChecklistCard checklistItems={event.EventChecklist} eventId={event.id} />}
        </div>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-2 my-2"}>
          {event?.EventTicket && <TicketsCard className={"order-last sm:order-first"} tickets={event.EventTicket} racers={racers} membershipTypes={membershipTypes} eventId={event.id} />}
          {event?.EventTicket && <TicketHoldersCard tickets={event.EventTicket} eventStart={new Date(event.startsAt)} />}
        </div>
        <Card className={"bg-ts-blue"}>
          <CardHeader>
            <CardTitle>Transport</CardTitle>
          </CardHeader>
        </Card>
      </>
    )
  } catch (e) {
    console.error(e);
  }
}