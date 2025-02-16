"use client";

import { Badge } from "@/components/ui/badge";
import { CircleCheckBig, EllipsisVertical, Ticket as TicketIcon, Unlink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { GiFullMotorcycleHelmet } from "react-icons/gi";

type Ticket = Tables<'EventTicket'> & { EventTicketAllocation: TicketAllocation[] }
type TicketAllocation = Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn: Tables<'EventTicketAllocationCheckIn'> | null }

export default function TicketAllocation({ ticket, allocation, canCheckIn }: { ticket: Ticket, allocation: TicketAllocation, canCheckIn: boolean }) {
  const isCheckedIn = !(!allocation.EventTicketAllocationCheckIn);
  const [isPerformingCheckIn, setIsPerformingCheckIn] = useState<boolean>(false);
  const [isPerformingUnassignment, setIsPerformingUnassignment] = useState<boolean>(false);
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

  async function performUnassignment() {
    setIsPerformingUnassignment(true);

    try {
      const supabase = createClient();

      await supabase.from("EventTicketAllocation")
        .delete()
        .eq("id", allocation.id)
        .throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPerformingUnassignment(false);
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <Card
          className={'bg-ts-blue-400 rounded-lg border border-ts-gold-700 p-2'}
        >
          <CardHeader className={"flex flex-row gap-1 items-start justify-between"}>
            <div className={"flex flex-col space-y-1.5"}>
              <h4 className={"font-bold"}>{allocation.Racers.fullName}</h4>
              <Badge className={"bg-ts-blue-200 w-fit"} variant={"outline"}>
                <TicketIcon className={"mr-2"}/>
                <span>{ticket?.name}</span>
              </Badge>
            </div>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
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
          <DropdownMenuContent className="w-56" align={"end"}>
            <DropdownMenuItem asChild>
              <Link href={`/racers/${allocation.Racers.id}`}>
                <GiFullMotorcycleHelmet />
                View Racer Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500"}
              >
                <Unlink />
                Unassign
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </Card>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Ticket Unassignment</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will unassign {allocation.Racers.fullName} from {ticket.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
          <AlertDialogCancel className={"m-0"}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant={"destructive"}
              loading={isPerformingUnassignment}
              onClick={() => performUnassignment()}
            >
              Confirm
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}