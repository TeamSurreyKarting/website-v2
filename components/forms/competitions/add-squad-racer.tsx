"use client";

import { Tables } from "@/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  competition: z.string().uuid().readonly(),
  racer: z.string().uuid(),
})

export function AddSquadRacerForm({ competition, racers }: { competition: Tables<'Competitions'>, racers: Tables<'Racers'>[] }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition: competition.id,
      racer: undefined,
    }
  });
  const { toast } = useToast();
  const { refresh } = useRouter();

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      // add to squad
      await supabase.from("CompetitionSquad").insert(values).throwOnError();

      // Finish
      refresh();
      setDialogOpenState(false);

      toast({ title: "Added racer to squad", description: `${racers.find((r) => r.id === form.getValues().racer)?.fullName} is now a part of the squad for ${competition.name}` })
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to add racer to squad", description: (e as Error).message });
    }
  }

  return (
    <ResponsiveModal
      title={"Add Driver To Squad"}
      trigger={
        <Button>
          <UserPlus />
          <span>Add Driver</span>
        </Button>
      }
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
                      { racers.map((racer) => (
                        <SelectItem
                          key={racer.id}
                          value={racer.id}
                        >
                          {racer.fullName}
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