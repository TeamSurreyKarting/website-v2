"use client";

import { Tables } from "@/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tickets, UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import RacerCombobox from "@/components/racers/combobox";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker/picker";
import CurrencyInput from "react-currency-input-field";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

type Ticket = (Tables<'EventTicket'> & { EventTicketAllocation: Tables<'EventTicketAllocation'>[] });

const ticketTypeFormSchema = z.object({
  event: z.string().uuid(),
  membershipType: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  availableFrom: z.date().min(new Date()),
  availableUntil: z.date().min(new Date()),
  maxAvailable: z.number().min(0),
}).refine((data) => data.availableUntil > data.availableFrom, {
  message: "Available Until must be after Available From",
  path: ["availableUntil"],
});

const ZERO_UUID = "00000000-0000-0000-0000-000000000000";

const ticketAssignmentFormSchema = z.object({
  racer: z.string().uuid(),
  eventTicket: z.string().uuid(),
});

export default function TicketsCard({ className, tickets, racers, membershipTypes, eventId }: { className?: string, tickets: Ticket[], racers: Tables<'Racers'>[], membershipTypes: Tables<'MembershipTypes'>[], eventId: string }) {
  const [ticketTypeDialogIsOpen, setTicketTypeDialogOpen] = useState<boolean>(false);
  const [ticketAssignmentDialogIsOpen, setTicketAssignmentDialogIsOpen] = useState<boolean>(false);
  const { refresh } = useRouter();

  const ticketTypeForm = useForm<z.infer<typeof ticketTypeFormSchema>>({
    resolver: zodResolver(ticketTypeFormSchema),
    defaultValues: {
      event: eventId,
      membershipType: undefined,
      name: undefined,
      price: undefined,
      availableFrom: undefined,
      availableUntil: undefined,
      maxAvailable: 0,
    }
  });

  const ticketAssignmentForm = useForm<z.infer<typeof ticketAssignmentFormSchema>>({
    resolver: zodResolver(ticketAssignmentFormSchema),
    defaultValues: {
      racer: undefined,
      eventTicket: undefined,
    }
  });

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

  async function submitTicketTypeForm(values: z.infer<typeof ticketTypeFormSchema>) {
    try {
      const supabase = createClient();

      await supabase.from("EventTicket").insert({
        ...values,
        membershipType: values.membershipType === ZERO_UUID ? undefined : values.membershipType,
      }).throwOnError();

      setTicketTypeDialogOpen(false);
      refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Card className={cn("bg-ts-blue", className)}>
        <CardHeader className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
          <CardTitle>Tickets</CardTitle>
          <div className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
            <Button onClick={() => setTicketTypeDialogOpen(!ticketTypeDialogIsOpen)}>
              <Tickets />
              <span>Add Ticket Type</span>
            </Button>
            <Button onClick={() => setTicketAssignmentDialogIsOpen(!ticketAssignmentDialogIsOpen)}>
              <UserPlus />
              <span>Assign Ticket</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          {tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)}
        </CardContent>
      </Card>
      <Dialog open={ticketAssignmentDialogIsOpen} onOpenChange={setTicketAssignmentDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ticket Assignment</DialogTitle>
          </DialogHeader>
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
              <LoadingButton
                loading={ticketTypeForm.formState.isLoading}
                className={"float-right bg-white text-black"}
                type={"submit"}
              >
                Add
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={ticketTypeDialogIsOpen} onOpenChange={setTicketTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ticket Type</DialogTitle>
          </DialogHeader>
          <Form {...ticketTypeForm}>
            <form onSubmit={ticketTypeForm.handleSubmit(submitTicketTypeForm)} className={"space-y-6"}>
              <FormField
                control={ticketTypeForm.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                  )}
              />
              <FormField
                control={ticketTypeForm.control}
                name={"price"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        customInput={Input}
                        placeholder={'£'}
                        prefix={"£"}
                        decimalsLimit={2}
                        decimalScale={2}
                        intlConfig={{ locale: "en-GB", currency: "GBP" }}
                        defaultValue={field.value}
                        onValueChange={(value) => field.onChange(Number(value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ticketTypeForm.control}
                name={"membershipType"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Restriction</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Membership" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ZERO_UUID}>Non-Member</SelectItem>
                          <SelectSeparator />
                          { membershipTypes.map((membershipType) => (
                            <SelectItem
                              key={membershipType.id}
                              value={membershipType.id}
                            >
                              {membershipType.name}
                            </SelectItem>
                          )) }
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
                <FormField
                  control={ticketTypeForm.control}
                  name={"availableFrom"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal bg-ts-blue-500 border border-white",
                                field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                 <span>Pick a date</span>
                               )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-ts-blue-500 text-white">
                          <Calendar
                            mode={"single"}
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                          <TimePicker date={field.value} dateDidSet={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                    )}
                />
                <FormField
                  control={ticketTypeForm.control}
                  name={"availableUntil"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Until</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal bg-ts-blue-500 border border-white",
                                field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP HH:mm")
                              ) : (
                                 <span>Pick a date</span>
                               )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-ts-blue-500 text-white">
                          <Calendar
                            mode={"single"}
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                          <TimePicker date={field.value} dateDidSet={field.onChange} />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={ticketTypeForm.control}
                name={"maxAvailable"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number Available</FormLabel>
                    <FormControl>
                      <Input
                        type={"number"}
                        min={0}
                        {...field}
                        defaultValue={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Set to zero to have unlimited tickets</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={ticketTypeForm.formState.isLoading}
                className={"float-right bg-white text-black"}
                type={"submit"}
              >
                Add
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

// todo: form for editing ticket item
const ticketEditFormSchema = z.object({
  ticket: z.string().uuid(),
})

function TicketItem({ ticket }: { ticket: Ticket }) {
  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={"bg-ts-blue-400 p-2 rounded-lg border border-ts-gold-700"}
    >
      <h4 className={"text-md font-bold"}>{ticket.name}</h4>
      <p>Price: <strong>{gbpFormat.format(ticket.price)}</strong></p>
      <div className={"flex flex-row gap-2 items-center"}>
        <span>{ticket.EventTicketAllocation.length}/{ticket.maxAvailable}</span>
        <Progress value={(ticket.EventTicketAllocation.length/ticket.maxAvailable) * 100} />
      </div>
    </div>
  )
}