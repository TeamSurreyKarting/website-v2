"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker/picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/database.types";
import { useToast } from "@/hooks/use-toast";
import CurrencyInput from "react-currency-input-field";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  startsAt: z.date().min(new Date()),
  endsAt: z.date().min(new Date()),
  tickets: z.object({
    membershipType: z.string().uuid(),
    name: z.string(),
    price: z.number(),
    availableFrom: z.date().min(new Date()),
    availableUntil: z.date().min(new Date()),
    maxAvailable: z.number().min(0),
  }).array(),
}).refine((data) => data.endsAt > data.startsAt, {
  message: "Ends At must be after Starts At",
  path: ["endsAt"],
});

const ZERO_UUID = "00000000-0000-0000-0000-000000000000";

type CreateTicket = {
  membershipType: string | undefined,
  name: string | undefined,
  price: number | undefined,
  availableFrom: Date | undefined,
  availableUntil: Date | undefined,
  maxAvailable: number
}

export default function NewEventForm({ membershipTypes }: { membershipTypes: Tables<'MembershipTypes'>[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startsAt: undefined,
      endsAt: undefined,
      tickets: [],
    }
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      const eventData = {
        name: values.name,
        startsAt: values.startsAt.toISOString(),
        endsAt: values.endsAt.toISOString(),
      }

      // create event
      const { data: event } = await supabase.from("Events").insert(eventData).select().maybeSingle().throwOnError()

      if (!event) {
        throw new Error("Failed ot create new event")
      }

      // create ticket types
      await supabase.from("EventTicket").insert(values.tickets.map((ticket) => {
        return {
          event: event.id,
          name: ticket.name,
          price: ticket.price,
          membershipType: ticket.membershipType === ZERO_UUID ? null : ticket.membershipType,
          availableFrom: ticket.availableFrom.toISOString(),
          availableUntil: ticket.availableUntil.toISOString(),
          maxAvailable: ticket.maxAvailable,
        }
      })).throwOnError()

      toast({ title: "Created New Event" })

      redirect(`/events/${event.id}`)
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Error creating event", description: (e as Error).message })
    }
  }

  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
        <Card className={"p-2 bg-ts-blue-600"}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className={"space-y-6"}>
            <FormField
              control={form.control}
              name={"name"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
              <FormField
                control={form.control}
                name={"startsAt"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starts At</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "max-w-[280px] ml-4 pl-3 text-left font-normal bg-ts-blue-500 border border-white",
                              !field.value && "text-muted-foreground"
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
                          disabled={(date) =>
                            date < new Date()
                          }
                        />
                        <TimePicker date={field.value} dateDidSet={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"endsAt"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ends At</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "max-w-[280px] ml-4 pl-3 text-left font-normal bg-ts-blue-500 border border-white",
                              !field.value && "text-muted-foreground"
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
                          disabled={(date) =>
                            date > form.getValues().endsAt
                          }
                        />
                        <TimePicker date={field.value} dateDidSet={field.onChange} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <FormField
          control={form.control}
          name={"tickets"}
          render={({ field }) => {
            const [dialogOpen, setDialogOpen] = useState(false);
            const [ticketToAdd, setTicketToAdd] = useState<CreateTicket>({
              name: "",
              price: 0,
              membershipType: undefined,
              availableFrom: undefined,
              availableUntil: form.getValues().startsAt,
              maxAvailable: 1
            });

            function handleCreateTicket(ticket: CreateTicket) {
              const hasIncompleteFields = !ticket.availableFrom || !ticket.availableUntil || !ticket.name || !ticket.membershipType || !ticket.price;
              console.debug("hasIncomplete", hasIncompleteFields);

              if (hasIncompleteFields) {
                let incompleteFields = [];

                if (!ticket.name) {
                  incompleteFields.push("name");
                }

                if (!ticket.price) {
                  incompleteFields.push("price");
                }

                if (!ticket.availableFrom) {
                  incompleteFields.push('Available From');
                }

                if (!ticket.availableUntil) {
                  incompleteFields.push('Available To');
                }

                if (!ticket.membershipType) {
                  incompleteFields.push('Membership Type');
                }

                console.debug("incompleteFields", incompleteFields);

                toast({
                  variant: "destructive",
                  title: "Error adding ticket type",
                  description: "You have not completed all of the fields. Please fill the following: " + incompleteFields.join(", "),
                })
                return;
              }

              const unconditionalTicketBody = {
                name: ticket.name!,
                price: ticket.price!,
                membershipType: ticket.membershipType!,
                availableFrom: ticket.availableFrom!,
                availableUntil: ticket.availableUntil!,
                maxAvailable: ticket.maxAvailable!,
              }

              form.setValue("tickets", [...form.getValues().tickets, unconditionalTicketBody]);
              console.log("tickets", form.getValues().tickets);
              setDialogOpen(false);
            }

            function handleRemoveTicket(ticketName: string) {
              form.setValue("tickets", form.getValues().tickets.filter(ticket => ticket.name !== ticketName));
            }

            return (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Card className={"p-2 bg-ts-blue-600"}>
                  <CardHeader className={"flex flex-row gap-x-2 items-center justify-between"}>
                    <CardTitle>Tickets</CardTitle>
                    <DialogTrigger asChild>
                      <Button>
                        <FaPlus />
                        <span>Add</span>
                      </Button>
                    </DialogTrigger>
                  </CardHeader>
                  <CardContent className={"space-y-6 flex flex-col gap-2"}>
                    {form.watch("tickets") && field.value.map((ticket) => (
                      <Card key={ticket.membershipType} className={"bg-ts-blue-700"}>
                        <CardHeader className={"flex flex-row gap-x-2 items-center justify-between"}>
                          <div>
                            <CardTitle>{ticket.name}</CardTitle>
                            <CardDescription>{gbpFormat.format(ticket.price)} - {ticket.maxAvailable} ticket{ticket.maxAvailable === 1 ? '' : 's'} available</CardDescription>
                          </div>
                          <Button size={"icon"} onClick={() => handleRemoveTicket(ticket.name)}>
                            <FaTrash />
                          </Button>
                        </CardHeader>
                        <CardContent className={"text-sm"}>
                          <p>Available From: <strong>{format(ticket.availableFrom, 'PPP HH:mm')}</strong></p>
                          <p>Available To: <strong>{format(ticket.availableUntil, 'PPP HH:mm')}</strong></p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Ticket Type</DialogTitle>
                  </DialogHeader>
                  <div className={"space-y-4"}>
                    <FormItem>
                      <FormLabel>Ticket Name</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={ticketToAdd.name}
                          onChange={(event) =>
                            setTicketToAdd({...ticketToAdd, name: event.target.value})
                          }
                        />
                      </FormControl>
                    </FormItem>
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
                          onValueChange={(value) => setTicketToAdd({...ticketToAdd, price: Number(value)})
                        }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Membership Restriction</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={ticketToAdd.membershipType}
                          onValueChange={(value) => setTicketToAdd({...ticketToAdd, membershipType: value})}
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
                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
                      <FormItem>
                        <FormLabel>Available From</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full text-left font-normal bg-ts-blue-500 border border-white",
                                  !ticketToAdd.availableFrom && "text-muted-foreground"
                                )}
                              >
                                {ticketToAdd.availableFrom ? (
                                  format(ticketToAdd.availableFrom, "PPP HH:mm")
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
                              selected={ticketToAdd.availableFrom}
                              onSelect={(newDate) => setTicketToAdd({...ticketToAdd, availableFrom: newDate})}
                            />
                            <TimePicker date={ticketToAdd.availableFrom} dateDidSet={(newDate) => setTicketToAdd({...ticketToAdd, availableFrom: newDate, availableUntil: newDate})} />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Available Until</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full text-left font-normal bg-ts-blue-500 border border-white",
                                  !ticketToAdd.availableUntil && "text-muted-foreground"
                                )}
                              >
                                {ticketToAdd.availableUntil ? (
                                  format(ticketToAdd.availableUntil, "PPP HH:mm")
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
                              selected={ticketToAdd.availableUntil}
                              onSelect={(newDate) => setTicketToAdd({...ticketToAdd, availableUntil: newDate})}
                            />
                            <TimePicker date={ticketToAdd.availableUntil} dateDidSet={(newDate) => setTicketToAdd({...ticketToAdd, availableUntil: newDate})} />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    </div>
                    <FormItem>
                      <FormLabel>Number Available</FormLabel>
                      <FormControl>
                        <Input
                          type={"number"}
                          min={0}
                          defaultValue={ticketToAdd.maxAvailable}
                          onChange={(event) =>
                            setTicketToAdd({...ticketToAdd, maxAvailable: Number(event.target.value)})
                          }
                        />
                      </FormControl>
                      <FormDescription>Set to zero to have unlimited tickets</FormDescription>
                    </FormItem>
                  </div>
                  <Button onClick={() => handleCreateTicket(ticketToAdd)}>
                    <FaPlus />
                    Add
                  </Button>
                </DialogContent>
              </Dialog>
            );
          }}
        />
        <LoadingButton
          variant={"secondary"}
          loading={form.formState.isLoading}
        >
          Submit
        </LoadingButton>
      </form>
    </Form>
  )
}