"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { Button } from "@/components/ui/button";
import { Plus, Bus, OctagonAlert, ChevronsUpDown, Check, EllipsisVertical, Unlink, UserMinus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import RacerCombobox from "@/components/racers/combobox";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { PiSteeringWheelFill } from "react-icons/pi";
import { IoPerson } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import pluralize from "pluralize";

const addDriverFormSchema = z.object({
  event: z.string().uuid().readonly(),
  driver: z.string().uuid(),
  maxCapacity: z.number(),
  additionalDetails: z.string().optional(),
});

const assignTixToVehFormSchema = z.object({
  transport: z.string().uuid(),
  ticketAllocation: z.string().uuid(),
});

type Transport = Tables<'EventTransport'> & { Racers: Tables<'Racers'>, EventTransportAllocation: Tables<'EventTransportAllocation'>[] }
type TicketAllocation = Tables<'EventTicketAllocation'> & { Racers: Tables<'Racers'>, EventTicketAllocationCheckIn: Tables<'EventTicketAllocationCheckIn'> | null }

export default function TransportCard({ eventId, transport, ticketAllocations }: { eventId: string, transport: Transport[], ticketAllocations: TicketAllocation[] }) {
  const [addDriverDialogIsOpen, setAddDriverDialogOpen] = useState<boolean>(false);
  const [assignTixToVehDialogIsOpen, setAssignTixToVehDialogOpen] = useState<boolean>(false);
  const addDriverForm = useForm<z.infer<typeof addDriverFormSchema>>({
    resolver: zodResolver(addDriverFormSchema),
    defaultValues: {
      event: eventId,
      driver: undefined,
      maxCapacity: 4,
      additionalDetails: undefined,
    }
  });
  const assignTixToVehForm = useForm<z.infer<typeof assignTixToVehFormSchema>>({
    resolver: zodResolver(assignTixToVehFormSchema),
    defaultValues: {
      transport: undefined,
      ticketAllocation: undefined,
    }
  });
  const { refresh } = useRouter();

  async function submitAddDriver(values: z.infer<typeof addDriverFormSchema>) {
    try {
      const supabase = createClient();

      const { data } = await supabase
        .from("EventTransport")
        .insert(values)
        .select()
        .single()
        .throwOnError();

      console.debug("eventTransport", data);

      // if driver has ticketAllocation, insert transport allocation
      const driverTicketAllocation = ticketAllocations.find((ta) => ta.Racers.id === values.driver);
      console.debug("driverTicketAllocation", driverTicketAllocation);

      if (driverTicketAllocation !== undefined) {
        await supabase
          .from("EventTransportAllocation")
          .insert({
            ticketAllocation: driverTicketAllocation.id,
            transport: data.id,
          })
          .throwOnError();
      }

      refresh();
      setAddDriverDialogOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  async function submitTixToVeh(values: z.infer<typeof assignTixToVehFormSchema>) {
    try {
      // Ensure that vehicle has space to allocate
      const vehicle = transport.find((t) => t.id === values.transport);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      const doesDriverHaveTicket = ticketAllocations.filter((ta) => ta.racer === vehicle.driver).length > 0;
      const hasSpace = ((doesDriverHaveTicket ? vehicle.maxCapacity : vehicle.maxCapacity - 1) - vehicle.EventTransportAllocation.length > 0);

      if (!hasSpace) {
        assignTixToVehForm.setError("transport", { type: "validate", message: "Vehicle is over capacity. Please select a different vehicle."})
        throw new Error("Vehicle is over capacity");
      }

      // Send to db
      const supabase = createClient();

      await supabase
        .from("EventTransportAllocation")
        .insert(values)
        .throwOnError();

      refresh();
      setAssignTixToVehDialogOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  const ticketAllocationIds = new Set(ticketAllocations.map((ta) => ta.id));
  const assignedTicketAllocationIds = new Set(transport.flatMap((t) => t.EventTransportAllocation).map((eta) => eta.ticketAllocation));
  const unassignedTicketAllocationIds = [...ticketAllocationIds.difference(assignedTicketAllocationIds)];
  const unassignedTicketAllocations = ticketAllocations.filter((ta) => unassignedTicketAllocationIds.includes(ta.id));

  return (
    <>
      <Card className={"bg-ts-blue"}>
        <CardHeader className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
          <div className={"flex flex-col space-y-1.5"}>
            <CardTitle>Transport</CardTitle>

            {unassignedTicketAllocationIds.length > 0 && (
              <CardDescription className={"rounded-full text-sm flex flex-row gap-3 items-center bg-red-700 px-3 py-1.5"}>
                <OctagonAlert className={"h-5 w-5"} />
                <span>{unassignedTicketAllocationIds.length} ticket {pluralize('holder', unassignedTicketAllocationIds.length)} requires vehicle assignment</span>
              </CardDescription>
            )}
          </div>
          <div className={"flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between"}>
            <Button onClick={() => setAddDriverDialogOpen(true)}>
              <Plus />
              <span>Add Driver/Vehicle</span>
            </Button>
            <Button onClick={() => setAssignTixToVehDialogOpen(true)}>
              <Bus />
              <span>Assign Ticket Holder to Vehicle</span>
            </Button>
          </div>
        </CardHeader>
        { transport.length > 0 && (
          <CardContent
            className={"grid grid-cols-1 lg:grid-cols-2 gap-3"}
          >
            {
              transport.map((t) => <TransportVehicleCard key={t.id} transportVehicle={t} ticketAllocations={ticketAllocations} />)
            }
          </CardContent>
        )}
      </Card>
      <Dialog open={addDriverDialogIsOpen} onOpenChange={setAddDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Driver/Vehicle</DialogTitle>
          </DialogHeader>
          <Form {...addDriverForm}>
            <form onSubmit={addDriverForm.handleSubmit(submitAddDriver)} className={"space-y-6"}>
              <FormField
                control={addDriverForm.control}
                name={"driver"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <FormControl>
                      <RacerCombobox
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        fullWidth={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addDriverForm.control}
                name={"maxCapacity"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type={"number"}
                        min={1}
                        {...field}
                        value={undefined}
                        defaultValue={field.value}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Include the driver in your capacity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addDriverForm.control}
                name={"additionalDetails"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        className={"resize-none"}
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
              <LoadingButton
                loading={addDriverForm.formState.isLoading}
                className={"float-right bg-white text-black"}
                type="submit"
              >
                Add
              </LoadingButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={assignTixToVehDialogIsOpen} onOpenChange={setAssignTixToVehDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket Holder to Vehicle</DialogTitle>
          </DialogHeader>
          <Form {...assignTixToVehForm}>
            <form onSubmit={assignTixToVehForm.handleSubmit(submitTixToVeh)} className={"space-y-6"}>
              <FormField
                control={assignTixToVehForm.control}
                name={"transport"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver/Vehicle</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between bg-ts-blue-600 text-white mt-2",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                             ? transport.find(
                                (t) => t.id === field.value
                              )?.Racers.fullName
                             : "Select driver/vehicle"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[200px] p-0 bg-ts-blue-600 text-white"
                        align={"end"}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search drivers/vehicles..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No drivers/vehicles found.</CommandEmpty>
                            <CommandGroup>
                              {
                                transport.map((t) => (
                                  <CommandItem
                                    value={t.id}
                                    key={t.id}
                                    onSelect={() => {
                                      field.onChange(t.id)
                                    }}
                                  >
                                    {t.Racers.fullName}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        t.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              }
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={assignTixToVehForm.control}
                name={"ticketAllocation"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Holder</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={assignTixToVehForm.getValues().transport === undefined}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between bg-ts-blue-600 text-white mt-2",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                             ? unassignedTicketAllocations.find(
                                (uta) => uta.id === field.value
                              )?.Racers.fullName
                             : "Select ticket holder"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[200px] p-0 bg-ts-blue-600 text-white"
                        align={"end"}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search ticket holders..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No ticket holders found.</CommandEmpty>
                            <CommandGroup>
                              {
                                unassignedTicketAllocations.map((uta) => {
                                  if (uta.Racers.id === assignTixToVehForm.getValues().transport) { return null; }

                                  return (
                                    <CommandItem
                                      value={uta.id}
                                      key={uta.id}
                                      onSelect={() => {
                                        assignTixToVehForm.setValue("ticketAllocation", uta.id)
                                      }}
                                    >
                                      {uta.Racers.fullName}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          uta.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  )
                                })
                              }
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Note: The driver of the vehicle is already assigned to themselves.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton
                loading={assignTixToVehForm.formState.isLoading}
                className={"float-right bg-white text-black"}
                type="submit"
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

function TransportVehicleCard({ transportVehicle, ticketAllocations }: { transportVehicle: Transport, ticketAllocations: TicketAllocation[] }) {
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const { refresh } = useRouter();

  const doesDriverHaveTicket = ticketAllocations.filter((ta) => ta.racer === transportVehicle.driver).length > 0;

  async function onDelete() {
    try {
      setDeleting(true);

      const supabase = createClient();

      await supabase.from("EventTransport").delete().eq("id", transportVehicle.id).throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <Card className={"bg-ts-blue-400"}>
          <CardHeader>
            <div className={"flex flex-row justify-between items-center gap-2"}>
              <div className={"flex flex-col space-y-1.5"}>
                <CardTitle>{transportVehicle.Racers.fullName}</CardTitle>
                <CardDescription>{transportVehicle.additionalDetails}</CardDescription>
              </div>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
              <span>{transportVehicle.EventTransportAllocation.length}/{doesDriverHaveTicket ? transportVehicle.maxCapacity : (transportVehicle.maxCapacity - 1)}</span>
              <Progress value={(transportVehicle.EventTransportAllocation.length/(doesDriverHaveTicket ? transportVehicle.maxCapacity : (transportVehicle.maxCapacity - 1))) * 100} />
            </div>
          </CardHeader>
          <CardContent className={"flex flex-col gap-2"}>
            {transportVehicle.EventTransportAllocation.map((transAlloc) => {
              const ticketAlloc = ticketAllocations.find((ta) => ta.id === transAlloc.ticketAllocation);
              if (!ticketAlloc) return;

              const isDriver = ticketAlloc?.Racers.id === transportVehicle.Racers.id;

              return <TransportVehicleAssignment
                key={transAlloc.id}
                transportAllocationId={transAlloc.id}
                ticketAllocation={ticketAlloc} isDriver={isDriver}
              />
            })}
          </CardContent>
        </Card>
        <DropdownMenuContent className="w-42" align={"end"}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500"}
            >
              <UserMinus />
              Remove Driver
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className={"bg-ts-blue-700 text-white"}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Driver Removal</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove the driver "{transportVehicle.Racers.fullName}" and all their assigned passengers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
          <AlertDialogCancel className={"m-0"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant={"destructive"}
              loading={isDeleting}
              onClick={() => { onDelete(); }}
            >
              Confirm Unlink
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function TransportVehicleAssignment({ isDriver, transportAllocationId, ticketAllocation }: { isDriver: boolean, transportAllocationId: string, ticketAllocation: TicketAllocation }) {
  const [isUnlinking, setUnlinking] = useState<boolean>(false);
  const { refresh } = useRouter();

  async function onUnlink() {
    setUnlinking(true);

    try {
      const supabase = createClient();

      await supabase.from("EventTransportAllocation").delete().eq("id", transportAllocationId).throwOnError();

      refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUnlinking(false);
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <div className={"bg-ts-blue-600 p-2 rounded-xl border border-ts-gold-700 flex flex-row gap-2 items-center justify-between"}>
          <div className={"flex flex-row gap-2 items-center"}>
            { isDriver ? (<PiSteeringWheelFill />) : (<IoPerson />) }
            <span>{ticketAllocation?.Racers.fullName}</span>
          </div>
          { !(isDriver) && (
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
          )}
        </div>
        <DropdownMenuContent className="w-42" align={"end"}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500"}
            >
              <Unlink />
              Unassign
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className={"bg-ts-blue-700 text-white"}>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Unlinking</AlertDialogTitle>
          <AlertDialogDescription>
            This action will unlink the ticket holder "{ticketAllocation?.Racers.fullName}" from this vehicle.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={"gap-x-3 gap-y-1.5"}>
          <AlertDialogCancel className={"m-0"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant={"destructive"}
              loading={isUnlinking}
              onClick={() => onUnlink()}
            >
              Confirm Unlink
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}