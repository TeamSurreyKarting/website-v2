"use client";

import { Tables } from "@/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EllipsisVertical, Pencil, Tickets, Trash2, UserPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import pluralize from "pluralize";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

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

export default function TicketsCard({ className, tickets, membershipTypes, eventId }: { className?: string, tickets: Ticket[], membershipTypes: Tables<'MembershipTypes'>[], eventId: string }) {
  const [ticketTypeDialogIsOpen, setTicketTypeDialogOpen] = useState<boolean>(false);
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

  const sortedTickets = tickets.sort((a, b) => a.price - b.price);

  return (
    <>
      <Card className={className}>
        <CardHeader className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
          <div className={"flex flex-col space-y-1.5"}>
            <CardTitle>Tickets</CardTitle>
            <CardDescription>{tickets.length} ticket {pluralize('type', tickets.length)}</CardDescription>
          </div>
          <div className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
            <Button onClick={() => setTicketTypeDialogOpen(!ticketTypeDialogIsOpen)}>
              <Tickets />
              <span>Add Ticket Type</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className={"flex flex-col gap-2"}>
          {sortedTickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} membershipTypes={membershipTypes} />)}
        </CardContent>
      </Card>
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
                              variant={"input"}
                              className={cn(
                                "w-full text-left font-normal",
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
                        <PopoverContent className="w-auto p-0">
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
                              variant={"input"}
                              className={cn(
                                "w-full text-left font-normal",
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
                        <PopoverContent className="w-auto p-0 ">
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
                className={"float-right"}
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

const ticketEditFormSchema = z.object({
  ticket: z.string().uuid(),
  membershipType: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  availableFrom: z.date(),
  availableUntil: z.date(),
  maxAvailable: z.number().min(0),
});

function TicketItem({ ticket, membershipTypes }: { ticket: Ticket, membershipTypes: Tables<'MembershipTypes'>[] }) {
  const ticketEditForm = useForm<z.infer<typeof ticketEditFormSchema>>({
    resolver: zodResolver(ticketEditFormSchema),
    defaultValues: {
      ticket: ticket.id,
      membershipType: ticket.membershipType === null ? ZERO_UUID : ticket.membershipType,
      name: ticket.name,
      price: ticket.price,
      availableFrom: new Date(ticket.availableFrom),
      availableUntil: new Date(ticket.availableUntil),
      maxAvailable: ticket.maxAvailable,
    }
  });
  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [ticketEditDialogIsOpen, setTicketEditDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { refresh } = useRouter();

  async function onSubmit(values: z.infer<typeof ticketEditFormSchema>) {
    try {
      const supabase = createClient();

      const updateBody = {
        membershipType: ticketEditForm.formState.dirtyFields.membershipType ? values.membershipType : undefined,
        name: ticketEditForm.formState.dirtyFields.name ? values.name : undefined,
        price: ticketEditForm.formState.dirtyFields.price ? values.price : undefined,
        availableFrom: ticketEditForm.formState.dirtyFields.availableFrom ? values.availableFrom.toISOString() : undefined,
        availableUntil: ticketEditForm.formState.dirtyFields.availableUntil ? values.availableUntil.toISOString() : undefined,
        maxAvailable: ticketEditForm.formState.dirtyFields.maxAvailable ? values.maxAvailable : undefined,
      }

      await supabase
        .from("EventTicket")
        .update(updateBody)
        .eq("id", values.ticket)
        .throwOnError();

      refresh();
      setTicketEditDialogOpen(false);

      ticketEditForm.reset();
    } catch (e) {
      console.error(e);
    }
  }

  async function onDelete() {
    setIsDeleting(true);

    try {
      const supabase = createClient();

      await supabase.from("EventTicket").delete().eq("id", ticket.id).throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <Card
            className={"bg-ts-blue-400 p-2 rounded-lg border border-ts-gold-700"}
          >
            <CardHeader className={"flex-row gap-x-3 justify-between"}>
              <div className={"flex flex-col space-y-1.5"}>
                <CardTitle className={"text-md font-bold"}>{ticket.name}</CardTitle>
                <CardDescription>Price: <strong>{gbpFormat.format(ticket.price)}</strong></CardDescription>
              </div>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
            </CardHeader>
            <CardContent>
              <div className={"flex flex-row gap-2 items-center"}>
                <span>{ticket.EventTicketAllocation.length}/{ticket.maxAvailable}</span>
                <Progress value={(ticket.EventTicketAllocation.length/ticket.maxAvailable) * 100} />
              </div>
            </CardContent>
          </Card>
          <DropdownMenuContent className="w-42" align={"end"}>
            <DropdownMenuItem onClick={() => setTicketEditDialogOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500"}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will de-allocate all assigned tickets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
            <AlertDialogCancel className={"m-0"}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <LoadingButton
                variant={"destructive"}
                loading={isDeleting}
                onClick={() => onDelete()}
              >
                Confirm Deletion
              </LoadingButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={ticketEditDialogIsOpen} onOpenChange={setTicketEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
          </DialogHeader>
          <Form {...ticketEditForm}>
            <form onSubmit={ticketEditForm.handleSubmit(onSubmit)} className={"space-y-6"}>
              <FormField
                control={ticketEditForm.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={undefined}
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ticketEditForm.control}
                name={"price"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        {...field}
                        customInput={Input}
                        placeholder={'£'}
                        prefix={"£"}
                        decimalsLimit={2}
                        decimalScale={2}
                        intlConfig={{ locale: "en-GB", currency: "GBP" }}
                        value={undefined}
                        defaultValue={field.value}
                        onValueChange={(value) => field.onChange(Number(value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ticketEditForm.control}
                name={"membershipType"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Restriction</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={undefined}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
                <FormField
                  control={ticketEditForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ticketEditForm.control}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={ticketEditForm.control}
                name={"maxAvailable"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number Available</FormLabel>
                    <FormControl>
                      <Input
                        type={"number"}
                        min={0}
                        {...field}
                        value={undefined}
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
                loading={ticketEditForm.formState.isLoading}
                className={"float-right bg-white text-black"}
                type="submit"
              >
                Update
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}