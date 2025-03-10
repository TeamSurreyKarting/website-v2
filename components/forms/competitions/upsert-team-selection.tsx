"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { ReactElement, useState } from "react";

const formSchema = z.object({
  team: z.string().uuid().readonly(),
  racer: z.string().uuid(),
})

type CompetitionEventTeamSelection = Tables<'CompetitionEventTeamSelection'> & { Racers: Tables<'Racers'> }

type CompetitionEventTeam = Tables<'CompetitionEventTeams'> & { CompetitionEventTeamSelection: CompetitionEventTeamSelection[] };

type UpsertTeamSelectionFormProps = {
  team: CompetitionEventTeam,
  squad: (Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> })[],
  defaultValue?: CompetitionEventTeamSelection,
  children: ReactElement,
}

export default function UpsertTeamSelectionForm({ team, squad, children, defaultValue }: UpsertTeamSelectionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team: team.id,
      racer: defaultValue?.racer,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      if (defaultValue && defaultValue.racer !== values.racer) {
        // remove the existing selection
        await supabase.from("CompetitionEventTeamSelection")
          .delete()
          .eq("id", defaultValue.id)
          .throwOnError();
      }

      await supabase
        .from("CompetitionEventTeamSelection")
        .upsert(values, { onConflict: "racer,team" })
        .throwOnError()

      refresh();
      setDialogOpenState(false);
      form.reset();
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", title: "Error assigning racer to team.", description: (error as Error).message });
    }
  }

  return (
    <ResponsiveModal
      title={"Add Squad Racer To Team"}
      trigger={children}
      open={dialogIsOpen}
      onOpenChange={setDialogOpenState}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
          <FormField
            control={form.control}
            name={"racer"}
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
                      { squad.map((sr) => {
                        const racerId = sr.racer;

                        return (
                          <SelectItem key={racerId} value={racerId}>{sr.Racers.fullName}</SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <div className={"max-md:w-full"}>
            <LoadingButton
              loading={form.formState.isLoading}
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