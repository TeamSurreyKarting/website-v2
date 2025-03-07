"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { redirect } from "next/navigation";
import { createUser } from "@/utils/actions/users/new";
import { createRacer } from "@/utils/actions/racers/new";
import MonthYearPicker from "@/components/ui/month-year-picker";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is invalid",
    })
    .email(),
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(2),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(2),
  graduationDate: z.date(),
  isAdministrator: z.boolean().default(false),
});

export function NewRacerForm() {
  const [formIsSubmitting, setFormSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      graduationDate: new Date(),
      isAdministrator: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormSubmitting(true);

    // Create user account
    const user = await createUser(
      values.email,
      values.firstName,
      values.lastName,
      values.isAdministrator,
    );

    // Determine graduation date
    const graduationDate = new Date(
      `01 ${values.graduationDate.getMonth()} ${values.graduationDate.getFullYear()}`,
    );

    // Create racer profile
    await createRacer(
      user.id!,
      values.firstName,
      values.lastName,
      graduationDate,
    );

    // Redirect to racers list on success
    redirect("/racers");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
        <div className={"grid grid-cols-1 gap-2 md:grid-cols-2"}>
          <FormField
            control={form.control}
            name={"firstName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder={"First Name"} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"lastName"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Last Name"} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={"Email"} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name={"graduationDate"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Date</FormLabel>
                <FormControl>
                  <MonthYearPicker bypassValidation={true} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"isAdministrator"}
          render={({ field }) => (
            <FormItem className="flex flex-row gap-0.5 items-center justify-between rounded-lg border p-3 shadow-xs">
              <div className="space-y-0.5">
                <FormLabel>Grant Administrator Privileges</FormLabel>
                <FormDescription className={"text-ts-gold-100"}>
                  Providing a user with administrator privileges grants them
                  access and permissions to view, edit, update and delete data
                  within the administration area.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          className={"float-right"}
          type={"submit"}
          loading={formIsSubmitting}
        >
          Create Racer
        </LoadingButton>
      </form>
    </Form>
  );
}
