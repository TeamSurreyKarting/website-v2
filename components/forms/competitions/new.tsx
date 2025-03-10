"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  name: z.string(),
})

export function NewCompetitionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  });
  const { toast } = useToast();
  const { replace } = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();

      const { data } = await supabase.from("Competitions").insert(values).select().maybeSingle().throwOnError();

      if (!data) {
        throw new Error("Failed to create competition");
      }

      toast({ title: "Created New Competition" });
      replace(`/competitions/${data.id}`)
    } catch (e) {
      console.error(e)
      toast({ variant: "destructive", title: "Error creating competition", description: (e as Error).message })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
        <Card className={"p-2"}>
          <CardHeader>
            <CardTitle>Competition Details</CardTitle>
          </CardHeader>
          <CardContent className={"space-y-6"}>
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
          </CardContent>
        </Card>
        <LoadingButton
          loading={form.formState.isLoading}
          className={"float-right"}
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  )
}