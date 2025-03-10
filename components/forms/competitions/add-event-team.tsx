"use client";

import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Plus } from "lucide-react";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  event: z.string().uuid().readonly(),
  name: z.string().min(1),
  minNumber: z.number().min(1),
  maxNumber: z.number().min(1),
}).refine(({ minNumber, maxNumber }) => maxNumber > minNumber, {
  message: "Minimum participants must be greater than maximum participants",
  path: ["maxNumber"],
});

export default function AddEventTeamForm({ competitionEvent }: { competitionEvent: Tables<'CompetitionEvents'> }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event: competitionEvent.id,
      name: "Surrey ",
      minNumber: 1,
      maxNumber: 4,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      await supabase
        .from("CompetitionEventTeams")
        .insert(values)
        .throwOnError();

      refresh();
      setDialogOpenState(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <ResponsiveModal
      title="Add Team"
      trigger={
        <Button>
          <Plus />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"minNumber"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Team Participants</FormLabel>
                <FormControl>
                  <Input type={"number"} {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"maxNumber"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Team Participants</FormLabel>
                <FormControl>
                  <Input type={"number"} {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                </FormControl>
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
              Add
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}