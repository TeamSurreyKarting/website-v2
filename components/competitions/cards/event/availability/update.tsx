"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleDashed, CircleX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tables } from "@/database.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import clsx from "clsx";

const formSchema = z.object({
  competitionEvent: z.string().uuid().readonly(),
  squadRacer: z.string().uuid().readonly(),
  isAvailable: z.boolean().optional(),
});

export default function UpdateSquadRacerAvailability({ compEventId, squadRacer, defaultValue }: { compEventId: string, squadRacer: Tables<'CompetitionSquad'> & { Racers: Tables<'Racers'> }, defaultValue?: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competitionEvent: compEventId,
      squadRacer: squadRacer.id,
      isAvailable: defaultValue,
    }
  });
  const { refresh } = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      if (values.isAvailable !== undefined) {
        const { data } = await supabase
          .from("CompetitionEventRacerAvailability")
          .upsert(values, { onConflict: 'competitionEvent, squadRacer' })
          .select()
          .maybeSingle()
          .throwOnError()

        if (!data) {
          throw new Error("Failed to upsert availability")
        }
      } else {
        await supabase
          .from("CompetitionEventRacerAvailability")
          .delete()
          .eq("competitionEvent", compEventId)
          .eq("squadRacer", squadRacer.id)
          .throwOnError();
      }

      refresh();
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to update availability", description: (e as Error).message });
    }
  }

  useEffect(() => {
    const subscription = form.watch(() => form.handleSubmit(onSubmit)())
    return () => subscription.unsubscribe();
  }, [form.handleSubmit, form.watch]);

  return (
    <div className={"flex flex-row gap-2 items-center justify-between"}>
      <span>
        {squadRacer.Racers.fullName}
      </span>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isOpen ? "default" : "ghost"}
            className={clsx("rounded-full", {
              'bg-green': form.getValues().isAvailable === true,
              'bg-red': form.getValues().isAvailable === false,
            })}
          >
            {(() => {
              switch (defaultValue) {
                case true:
                  return <CircleCheck />
                case false:
                  return <CircleX />
                default:
                  return <CircleDashed />
              }
            })()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit" align={"end"}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
              <FormField
                name={"isAvailable"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Update Availability
                      <Spinner show={form.formState.isLoading} />
                    </FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value === undefined ? "" : field.value.toString()}
                        onValueChange={(value) => {
                          switch (value) {
                            case "true":
                              field.onChange(true);
                              break;
                            case "false":
                              field.onChange(false);
                              break;
                            case "":
                              field.onChange(undefined);
                              break;
                          }
                        }}
                      >
                        <TabsList className={"w-full justify-between"}>
                          <TabsTrigger
                            value="false"
                            disabled={form.formState.isLoading}
                          >
                            <CircleX />
                          </TabsTrigger>
                          <TabsTrigger
                            value=""
                            disabled={form.formState.isLoading}
                          >
                            <CircleDashed />
                          </TabsTrigger>
                          <TabsTrigger
                            value="true"
                            disabled={form.formState.isLoading}
                          >
                            <CircleCheck />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  )
}