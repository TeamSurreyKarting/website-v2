"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tables } from "@/database.types";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  race: z.string().uuid().readonly(),
  teamRacer: z.string().uuid(),
  startingPosition: z.number().min(1).max(100),
})

type AssignDriverToRaceProps = {
  race: Tables<'CompetitionEventRaces'> & {
    CompetitionEventRaceEntrants: (Tables<'CompetitionEventRaceEntrants'> & {
      CompetitionEventTeamSelection: {
        id: string,
        CompetitionEventTeams: Tables<'CompetitionEventTeams'>,
        Racers: Tables<'Racers'>
      }
    })[]
  },
  competitionTeams: (Tables<'CompetitionEventTeams'> & {
    CompetitionEventTeamSelection: (Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> })[]
  })[]
  open?: boolean,
  onOpenChange?: (open: boolean) => void,
}

export default function AssignDriverToRace({ race, competitionTeams, open, onOpenChange }: AssignDriverToRaceProps) {
  const [internalOpen, onInternalOpenChange] = useState<boolean>(open ?? false);
  // Sync internal state with external prop if provided
  useEffect(() => {
    if (open !== undefined) {
      onInternalOpenChange(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    onInternalOpenChange(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      race: race.id,
      teamRacer: undefined,
      startingPosition: 1,
    }
  });
  const { refresh } = useRouter();
  const  { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = await createClient();

      await supabase.from("CompetitionEventRaceEntrants").insert(values).throwOnError();

      handleOpenChange(false);
      refresh();

      const matchedRacer = competitionTeams.flatMap((tr) => tr.CompetitionEventTeamSelection).find((ts) => ts.id === values.teamRacer);
      toast({ title: `Assigned ${matchedRacer ? matchedRacer.Racers.fullName : "selected racer"} to ${race.name}` })
    } catch (e) {
      console.error(e);
      toast({ title: `Failed to assign selected racer to ${race.name}` })
    }
  }

  return (
    <Dialog
      open={internalOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Racer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <FormField
              control={form.control}
              name={"teamRacer"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Racer</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Racer" />
                      </SelectTrigger>
                      <SelectContent>
                        { competitionTeams.flatMap(
                          (team) =>
                            team.CompetitionEventTeamSelection.map((teamRacer) =>
                              <SelectItem key={teamRacer.id} value={teamRacer.id}>
                                {teamRacer.Racers.fullName} ({team.name})
                              </SelectItem>
                          ))
                        }
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
                Assign To Race
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}