"use client";

import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Pencil, Plus } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const raceFormats = [
  {
    name: "Practice",
    value: "practice",
  },
  {
    name: "Qualifying",
    value: "qualifying",
  },
  {
    name: "Individual Sprint",
    value: "individual_sprint",
  },
  {
    name: "Team Endurance",
    value: "team_endurance",
  },
]

const formSchema = z.object({
  event: z.string().uuid().readonly(),
  format: z.enum(['practice', 'qualifying', 'individual_sprint', 'team_sprint', 'team_endurance']),
  startsAt: z.date(),
  duration: z.number().min(1),
  name: z.string(),
});

type RaceEventFormProps = {
  competitionEvent: (Tables<'CompetitionEvents'> & { Events: Tables<'Events'> | null }),
  defaultValues?: Tables<'CompetitionEventRaces'> | undefined,
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
}

export default function RaceEventForm({ competitionEvent, defaultValues, open, onOpenChange }: RaceEventFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: defaultValues ? defaultValues.event : competitionEvent.id,
      format: defaultValues ? defaultValues.format : undefined,
      startsAt: defaultValues ? new Date(defaultValues.startsAt) : (competitionEvent.Events?.startsAt ? new Date(competitionEvent.Events.startsAt) : undefined),
      duration: defaultValues ? defaultValues.duration : 15,
      name: defaultValues ? defaultValues.name : undefined,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(open ?? false);
  // Sync internal state with external prop if provided
  useEffect(() => {
    if (open !== undefined) {
      setDialogOpenState(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpenState(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      if (defaultValues) {
        await supabase.from("CompetitionEventRaces").update(values).eq("id", defaultValues.id).throwOnError();
        toast({ title: `Updated race '${values.name}'` })
      } else {
        await supabase.from("CompetitionEventRaces").insert(values).throwOnError();
        toast({ title: `Added race '${values.name}' to event` })
      }

      refresh();
      handleOpenChange(false);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error adding race to event" })
    }
  }

  return (
    <ResponsiveModal
      title={defaultValues ? "Edit Race" : "Add Race"}
      description={defaultValues?.name ?? undefined}
      trigger={defaultValues ? undefined : (
          <Button>
            <Plus />
            <span>Add Race</span>
          </Button>
        )}
      open={dialogIsOpen}
      onOpenChange={handleOpenChange}
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"format"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Race Format</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Race Format" />
                    </SelectTrigger>
                    <SelectContent>
                      { raceFormats.map(({ name, value }) => (
                        <SelectItem
                          key={value}
                          value={value}
                        >
                          {name}
                        </SelectItem>
                      )) }
                    </SelectContent>
                  </Select>
                </FormControl>
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
            name={"duration"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
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
                <FormDescription>Time in minutes.</FormDescription>
                <FormMessage />
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
              { defaultValues ? "Update" : "Add" }
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  )
}
