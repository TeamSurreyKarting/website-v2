"use client";

import { Badge } from "@/components/ui/badge";
import { CircleCheckBig, Ticket as TicketIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Ticket = Tables<'EventTicket'> & { EventTicketAllocation: TicketAllocation[] }
type TicketAllocation = Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn?: Tables<'EventTicketAllocationCheckIn'> }

export default function TicketAllocation({ ticket, allocation, canCheckIn }: { ticket: Ticket, allocation: TicketAllocation, canCheckIn: boolean }) {
  const isCheckedIn = !(!allocation.EventTicketAllocationCheckIn);
  const [isPerformingCheckIn, setIsPerformingCheckIn] = useState<boolean>(false);
  const { refresh } = useRouter();

  async function performCheckIn() {
    setIsPerformingCheckIn(true);

    try {
      const supabase = createClient();

      if (isCheckedIn) {
        // delete check-in
        await supabase
          .from("EventTicketAllocationCheckIn")
          .delete()
          .eq("id", allocation.id)
          .throwOnError();
      } else {
        // create check-in
        await supabase
          .from("EventTicketAllocationCheckIn")
          .insert({
            id: allocation.id,
          })
          .throwOnError();
      }

      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPerformingCheckIn(false);
    }
  }

  return (
    <Card
      className={'bg-ts-blue-400 rounded-lg border border-ts-gold-700 p-2'}
    >
      <CardHeader className={"flex flex-row gap-1 items-center justify-between"}>
        <h4 className={"font-bold"}>{allocation.Racers.fullName}</h4>
        <Badge className={"bg-ts-blue-200"} variant={"outline"}>
          <TicketIcon className={"mr-2"}/>
          <span>{ticket?.name}</span>
        </Badge>
      </CardHeader>
      { canCheckIn && (
        <CardContent>
          { !isCheckedIn ? (
            <LoadingButton
              className={"w-full"}
              variant={"outline"}
              loading={isPerformingCheckIn}
              disabled={isPerformingCheckIn}
              onClick={() => {
                if (!isCheckedIn && !isPerformingCheckIn) {
                  performCheckIn();
                }
              }}
            >
              Check In
            </LoadingButton>
          ) : (
            <Button className={"w-full bg-green-600"} variant={"outline"} disabled={isCheckedIn}>
              <CircleCheckBig />
              <span>Checked In</span>
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}