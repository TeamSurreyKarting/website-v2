import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type Event = Tables<'Events'> & {
  EventChecklist: Tables<'EventChecklist'>[],
  EventSchedule: Tables<'EventSchedule'>[],
  EventTicket: (Tables<'EventTicket'> & { EventTicketAllocation: Tables<'EventTicketAllocation'>[] })[],
  EventTransport: (Tables<'EventTransport'> & { EventTransportAllocation: Tables<'EventTransportAllocation'>[] })[]
}

async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Events")
    .select("*, EventChecklist( * ), EventSchedule( * ), EventTicket( *, EventTicketAllocation( * )), EventTransport( *, EventTransportAllocation( * ))")
    .eq("id", id)
    .maybeSingle()
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

    const event = await getEvent(id);

    if (!event) {
      console.error("missing event data for event from db")
      notFound();
    }

    return (
      <>
        <h2 className={"text-2xl font-bold"}>Event</h2>
        <h3 className={"text-xl font-medium text-ts-gold-700"}>
          {event.name}
        </h3>
      </>
    )
  } catch (e) {
    console.error(e);
  }
}