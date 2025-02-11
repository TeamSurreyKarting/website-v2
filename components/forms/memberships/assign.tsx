"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Database } from "@/database.types";
import { assignMembershipToUser } from "@/utils/actions/memberships/assign";

const formSchema = z.object({
  membership: z
    .string({
      required_error: "Membership is required",
      invalid_type_error: "Membership is invalid",
    })
    .uuid(),
  racer: z
    .string({
      required_error: "Racer is required",
      invalid_type_error: "Racer is invalid",
    })
    .uuid(),
});

export function AssignMembershipForm({
  memberships,
  racers,
  defaultRacer,
}: {
  memberships: Database["public"]["Tables"]["MembershipTypes"]["Row"][];
  racers: Database["public"]["Tables"]["Racers"]["Row"][];
  defaultRacer: string | null;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      membership: "",
      racer: defaultRacer ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // call server action
    try {
      await assignMembershipToUser(values.membership, values.racer);
    } catch (error) {
      console.error("failed assigning membership to user", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <FormField
            control={form.control}
            name={"membership"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a membership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships?.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"racer"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Racer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a racer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {racers?.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton
          className={
            "bg-ts-blue-700 hover:bg-white hover:text-black float-right"
          }
          variant={"outline"}
          type={"submit"}
          loading={form.formState.isSubmitting}
        >
          Assign Membership
        </LoadingButton>
      </form>
    </Form>
  );
}
