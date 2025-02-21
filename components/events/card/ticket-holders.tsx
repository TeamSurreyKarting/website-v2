"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pluralize from "pluralize";
import { isAfter, isBefore, sub } from "date-fns";
import { Tables } from "@/database.types";
import TicketAllocation from "@/components/events/card/ticket-allocation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RacerCombobox from "@/components/racers/combobox";
import { LoadingButton } from "@/components/ui/loading-button";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

type Ticket = Tables<'EventTicket'> & { EventTicketAllocation: TicketAllocation[] }
type TicketAllocation = Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn: Tables<'EventTicketAllocationCheckIn'> | null }

const ticketAssignmentFormSchema = z.object({
  racer: z.string().uuid(),
  eventTicket: z.string().uuid(),
});

export default function TicketHoldersCard({ tickets, eventStart }: { tickets: Ticket[], eventStart: Date }) {
  const [ticketAssignmentDialogIsOpen, setTicketAssignmentDialogIsOpen] = useState<boolean>(false);
  const ticketAssignmentForm = useForm<z.infer<typeof ticketAssignmentFormSchema>>({
    resolver: zodResolver(ticketAssignmentFormSchema),
    defaultValues: {
      racer: undefined,
      eventTicket: undefined,
    }
  });
  const { refresh } = useRouter();

  async function submitTicketAssignmentForm(values: z.infer<typeof ticketAssignmentFormSchema>) {
    try {
      const supabase = createClient();

      await supabase.from("EventTicketAllocation").insert(values).throwOnError();

      setTicketAssignmentDialogIsOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const ticketAllocations = tickets.flatMap((ticket) => ticket.EventTicketAllocation);

  const now = new Date();
  const twoHoursFromEventStart = sub(eventStart, { hours: 2 })
  const canCheckIn = isBefore(now, eventStart) && isAfter(now, twoHoursFromEventStart);

  return (
    <>
      <Card className={"order-first sm:order-last"}>
        <CardHeader className={"flex flex-row justify-between"}>
          <div className={"flex flex-col space-y-1.5"}>
            <CardTitle>Ticket Holders</CardTitle>
            <CardDescription>{ticketAllocations.length === 0 ? "No" : ticketAllocations.length} {pluralize('ticket', ticketAllocations.length)} allocated</CardDescription>
          </div>
          <ResponsiveModal
            title="Assign Ticket"
            trigger={
              <Button onClick={() => setTicketAssignmentDialogIsOpen(!ticketAssignmentDialogIsOpen)}>
                <UserPlus />
                <span>Assign Ticket</span>
              </Button>
            }
            open={ticketAssignmentDialogIsOpen}
            onOpenChange={setTicketAssignmentDialogIsOpen}
          >
            <Form {...ticketAssignmentForm}>
              <form onSubmit={ticketAssignmentForm.handleSubmit(submitTicketAssignmentForm)} className={"space-y-6"}>
                <FormField
                  control={ticketAssignmentForm.control}
                  name={"eventTicket"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            { tickets.map((ticket) => (
                              <SelectItem
                                key={ticket.id}
                                value={ticket.id}
                              >
                                {ticket.name}
                              </SelectItem>
                            )) }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ticketAssignmentForm.control}
                  name={"racer"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Racer</FormLabel>
                      <FormControl>
                        <RacerCombobox defaultValue={field.value} onValueChange={field.onChange} fullWidth={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className={"max-md:w-full"}>
                  <LoadingButton
                    loading={ticketAssignmentForm.formState.isLoading}
                    className={"w-full md:w-fit md:float-right"}
                    type={"submit"}
                  >
                    Add
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </ResponsiveModal>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          {ticketAllocations.map((ta) => {
            const ticket = tickets.find((ticket) => ticket.id === ta.eventTicket);
            if (!ticket) return;

            return <TicketAllocation key={ta.id} ticket={ticket} allocation={ta} canCheckIn={canCheckIn} />
          })}
        </CardContent>
      </Card>
    </>
  )
}

