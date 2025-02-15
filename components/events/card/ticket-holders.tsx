import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pluralize from "pluralize";
import { isAfter, isBefore, sub } from "date-fns";
import { Tables } from "@/database.types";
import TicketAllocation from "@/components/events/card/ticket-allocation";

type Ticket = Tables<'EventTicket'> & { EventTicketAllocation: TicketAllocation[] }
type TicketAllocation = Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn: Tables<'EventTicketAllocationCheckIn'> }

export default function TicketHoldersCard({ tickets, eventStart }: { tickets: Ticket[], eventStart: Date }) {
  const ticketAllocations = tickets.flatMap((ticket) => ticket.EventTicketAllocation);

  const now = new Date();
  const twoHoursFromEventStart = sub(eventStart, { hours: 2 })
  const canCheckIn = isBefore(now, eventStart) && isAfter(now, twoHoursFromEventStart);

  return (
    <Card className={"bg-ts-blue order-first sm:order-last"}>
      <CardHeader>
        <CardTitle>Ticket Holders</CardTitle>
        <CardDescription>{ticketAllocations.length === 0 ? "No" : ticketAllocations.length} {pluralize('ticket', ticketAllocations.length)} allocated</CardDescription>
      </CardHeader>
      <CardContent className={"flex flex-col gap-2"}>
        {ticketAllocations.map((ta) => {
          const ticket = tickets.find((ticket) => ticket.id === ta.eventTicket);
          if (!ticket) return;

          return <TicketAllocation key={ta.id} ticket={ticket} allocation={ta} canCheckIn={canCheckIn} />
        })}
      </CardContent>
    </Card>
  )
}

