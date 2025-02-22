"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CalendarIcon, CalendarPlus, Check, CircleCheck, CircleX, Clock, EllipsisVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker/picker";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

const addToScheduleFormSchema = z.object({
  event: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  scheduledFor: z.date(),
});

type ScheduleItem = {
  id: string,
  date: Date,
  title: string,
  description: string | null,
  hasOccurred: boolean,
}

export default function ScheduleCard({ schedule, eventId }: { schedule: Tables<'EventSchedule'>[], eventId: string }) {
  const [addToScheduleDialogIsOpen, setAddToScheduleDialogOpen] = useState<boolean>(false);
  const addToScheduleForm = useForm<z.infer<typeof addToScheduleFormSchema>>({
    resolver: zodResolver(addToScheduleFormSchema),
    defaultValues: {
      event: eventId,
      title: undefined,
      description: undefined,
      scheduledFor: undefined,
    }
  });
  const { refresh } = useRouter();

  async function onAddToScheduleFormSubmit(values: z.infer<typeof addToScheduleFormSchema>) {
    try {
      const supabase = createClient();

      await supabase.from("EventSchedule").insert({
        ...values,
        scheduledFor: values.scheduledFor.toISOString(),
      }).throwOnError();

      setAddToScheduleDialogOpen(false);
      refresh();
    } catch (e) {
      console.error(e);
    }
  }

  const now = new Date();
  const timelineItems = schedule.map((scheduleItem): ScheduleItem => {
    const itemScheduledFor = new Date(scheduleItem.scheduledFor);

    return {
      id: scheduleItem.id,
      date: itemScheduledFor,
      title: scheduleItem.title,
      description: scheduleItem.description,
      hasOccurred: now > itemScheduledFor,
    }
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <>
      <Card>
        <CardHeader className={"flex flex-row gap-2 items-center justify-between"}>
          <CardTitle>Schedule</CardTitle>
          <ResponsiveModal
            title="Add To Schedule"
            trigger={
              <Button>
                <CalendarPlus />
                <span>Add To Schedule</span>
              </Button>
            }
            open={addToScheduleDialogIsOpen}
            onOpenChange={setAddToScheduleDialogOpen}
          >
            <Form {...addToScheduleForm}>
              <form onSubmit={addToScheduleForm.handleSubmit(onAddToScheduleFormSubmit)} className={"space-y-6"}>
                <FormField
                  control={addToScheduleForm.control}
                  name={"title"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                  control={addToScheduleForm.control}
                  name={"description"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className={"resize-none"}
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={addToScheduleForm.control}
                  name={"scheduledFor"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occuring At</FormLabel>
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
                <div className={"max-md:w-full"}>
                  <LoadingButton
                    loading={addToScheduleForm.formState.isLoading}
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
          {timelineItems.map((item) => <TimelineItem key={item.id} item={item} />)}
        </CardContent>
      </Card>
    </>
  )
}

const editScheduleItemFormSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  scheduledFor: z.date(),
});

export function TimelineItem({ item }: { item: ScheduleItem } ) {
  const [isComplete, setComplete] = useState<boolean>(false);
  const [completionIsUpdating, setCompletionIsUpdating] = useState<boolean>(false);
  const [isDeletingItem, setIsDeletingItem] = useState<boolean>(false);
  const [editFormDialogIsOpen, setEditFormDialogIsOpen] = useState<boolean>(false);
  const editScheduleItemForm = useForm<z.infer<typeof editScheduleItemFormSchema>>({
    resolver: zodResolver(editScheduleItemFormSchema),
    defaultValues: {
      id: item.id,
      title: item.title,
      description: item.description ?? undefined,
      scheduledFor: item.date,
    }
  })
  const { refresh } = useRouter();

  async function editTimelineItem(values: z.infer<typeof editScheduleItemFormSchema>) {
    try {
      const supabase = createClient();

      await supabase
        .from("EventSchedule")
        .update({
          title: editScheduleItemForm.formState.dirtyFields.title ? values.title : undefined,
          description: editScheduleItemForm.formState.dirtyFields.description ? values.description : undefined,
          scheduledFor: editScheduleItemForm.formState.dirtyFields.scheduledFor ? values.scheduledFor.toISOString() : undefined,
        })
        .eq("id", values.id)
        .throwOnError();

      setEditFormDialogIsOpen(false);
      refresh();
    } catch (e) {
      console.log(e);
    }
  }

  async function updateTimelineCompletionStatus(capturedCompletionStatus: boolean) {
    setCompletionIsUpdating(true);

    try {
      const supabase = createClient();

      await supabase
        .from("EventSchedule")
        .update({
          completionStatus: capturedCompletionStatus,
        })
        .eq("id", item.id)
        .throwOnError();

      setComplete(capturedCompletionStatus);

      refresh();
    } catch (error) {
      console.error(error);
      setComplete(!capturedCompletionStatus);
    } finally {
      setCompletionIsUpdating(false);
    }
  }

  async function deleteTimelineItem() {
    setIsDeletingItem(true);

    try {
      const supabase = createClient();

      await supabase
        .from("EventSchedule")
        .delete()
        .eq("id", item.id)
        .throwOnError();

      refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingItem(false);
    }
  }

  return (
    <div className={"grid grid-cols-[1fr_7fr] gap-4 md:items-center"} data-complete={isComplete}>
      <div className={"flex flex-col gap-1 max-md:mt-6"}>
        <div className={"flex flex-row gap-2 items-center max-md:text-sm"}><Clock className={"h-4 w-4"} /> <span>{format(new Date(item.date), 'HH:mm')}</span></div>
        <div className={"flex flex-row gap-2 items-center max-md:text-sm"}><CalendarIcon className={"h-4 w-4"} /> <span>{format(new Date(item.date), 'd/M')}</span></div>
      </div>
      <Card className={clsx("w-full bg-ts-gold-300 dark:bg-ts-blue-400 flex flex-row gap-2 items-center justify-between", {
        'opacity-25': isComplete,
      })}>
        <CardHeader className={"flex flex-row justify-between items-start gap-2"}>
          <div className={"flex flex-col justify-evenly"}>
            <CardTitle className={"text-inherit"}>{item.title}</CardTitle>
            {item.description && (<CardDescription className={"text-sm"}>{item.description}</CardDescription>)}
          </div>
        </CardHeader>
        <CardContent className={"p-0 pr-6"}>
          <Dialog open={editFormDialogIsOpen} onOpenChange={setEditFormDialogIsOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"}>
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align={"end"}>
                <DropdownMenuGroup>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    disabled={completionIsUpdating}
                    onClick={() => {
                      if (!completionIsUpdating) {
                        updateTimelineCompletionStatus(!isComplete);
                      }
                    }}
                  >
                    { completionIsUpdating ? <Loader2 className={"h-4 w-4 animate-spin"} /> : (isComplete ? <CircleX /> : <CircleCheck />) }
                    <span className={completionIsUpdating ? "" : ""}>{ isComplete ? ("Mark as uncompleted") : ("Mark as completed") }</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500"}
                    disabled={isDeletingItem}
                    onClick={() => {
                      if (!isDeletingItem) {
                        deleteTimelineItem()
                      }
                    }}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Timeline Item</DialogTitle>
              </DialogHeader>
              <Form {...editScheduleItemForm}>
                <form onSubmit={editScheduleItemForm.handleSubmit(editTimelineItem)} className={"space-y-6"}>
                  <FormField
                    control={editScheduleItemForm.control}
                    name={"title"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
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
                    control={editScheduleItemForm.control}
                    name={"description"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className={"resize-none"}
                            defaultValue={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editScheduleItemForm.control}
                    name={"scheduledFor"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occuring At</FormLabel>
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
                  <LoadingButton
                    loading={editScheduleItemForm.formState.isLoading}
                    className={"float-right bg-white text-black"}
                    type={"submit"}
                  >
                    Update
                  </LoadingButton>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}