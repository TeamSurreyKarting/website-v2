"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { z } from "zod";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/database.types";

const formSchema = z.object({
  name: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  track: z.string().uuid(),
})

export function AddCompetitionEventForm({ competition, tracks }: { competition: Tables<'Competitions'>, tracks: Tables<'Tracks'>[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      startsAt: undefined,
      endsAt: undefined,
      track: undefined,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      // create event first
      const { data: event }: { data: Tables<'Events'> } = await supabase
        .from("Events")
        .insert({
          name: values.name,
          startsAt: values.startsAt.toISOString(),
          endsAt: values.endsAt.toISOString(),
        })
        .select()
        .returns<Tables<'Events'>>()
        .single()
        .throwOnError();

      console.log("event", event);

      if (!event) {
        throw new Error("Issue creating Event");
      }

      const eventId = event.id;
      console.log(eventId)

      // now create competition event
      const query = supabase.from("CompetitionEvents").insert({
        competition: competition.id,
        track: values.track,
        event: eventId
      });

      await query.throwOnError();

      // Finish
      refresh();
      setDialogOpenState(false);
      form.reset();
      toast({ title: "Created competition event", description: `${competition.name} has new event ${values.name}` });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to create competition event", description: (e as Error).message });
    }
  }

  return (
    <ResponsiveModal
      title="Add Event"
      trigger={
        <Button>
          <CalendarPlus />
          <span>Add Event</span>
        </Button>
      }
      open={dialogIsOpen}
      onOpenChange={setDialogOpenState}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
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
            <FormField
              control={form.control}
              name={"startsAt"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starts At</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      datetime={field.value}
                      onDatetimeChange={field.onChange}
                    />
                  </FormControl>
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
                  <FormControl>
                    <DateTimePicker
                      datetime={field.value}
                      onDatetimeChange={field.onChange}
                      disabled={!form.watch().startsAt}
                      min={form.watch().startsAt}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
            control={form.control}
            name={"track"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Track" />
                    </SelectTrigger>
                    <SelectContent>
                      { tracks.map((track) => (
                        <SelectItem
                          key={track.id}
                          value={track.id}
                        >
                          {track.name}
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <div className={"max-md:w-full"}>
            <LoadingButton
              loading={form.formState.isLoading}
              disabled={form.formState.isLoading}
              className={"w-full md:w-fit md:float-right"}
              type={"submit"}
            >
              Add
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  )
}