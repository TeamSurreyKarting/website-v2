"use client";

import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { Database } from "@/database.types";
import { clsx } from "clsx";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MonthYearPicker from "@/components/ui/month-year-picker";
import { editUser } from "@/utils/actions/users/edit";
import { editRacer } from "@/utils/actions/racers/edit";
import { revalidatePath } from "next/cache";
import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
});

export default function RacerDetails({
  details,
}: {
  details: Database["public"]["Views"]["RacerDetails"]["Row"];
}) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: details.email!,
      firstName: details.firstName!,
      lastName: details.lastName!,
      graduationDate: new Date(details.graduationDate!),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // No need to submit form if no changes made
    if (!form.formState.isDirty) return;

    const userEdit = editUser(
      details.id!,
      values.email,
      values.firstName,
      values.lastName,
    );
    const racerEdit = editRacer(
      details.id!,
      values.firstName,
      values.lastName,
      values.graduationDate,
    );

    console.log("requesting");
    const [userEditResult, racerEditResult] = await Promise.allSettled([
      userEdit,
      racerEdit,
    ]);
    console.log("results", userEditResult, racerEditResult);

    setIsEditing(false);

    revalidatePath(`/racers/${details.id!}`);
  }

  return (
    <Card>
      <CardHeader className={"flex flex-row gap-2 justify-between items-center"}>
        <CardTitle className={"font-medium text-xl"}>{isEditing ? "Edit Details" : "Details"}</CardTitle>
        <Button
          variant={"secondary"}
          className={clsx({
            hidden: isEditing,
          })}
          onClick={() => setIsEditing(true)}
          disabled={form.formState.isLoading}
        >
          <MdEdit />
          Edit
        </Button>
        <Spinner show={form.formState.isLoading} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"space-y-4 mt-2"}
          >
            <div className={"grid grid-cols-1 gap-2 md:grid-cols-2"}>
              <FormField
                control={form.control}
                name={"firstName"}
                data-initialData={details.firstName}
                disabled={!isEditing || form.formState.isLoading}
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
                data-initialData={details.lastName}
                disabled={!isEditing || form.formState.isLoading}
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
              data-initialData={details.email}
              disabled={!isEditing || form.formState.isLoading}
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
                disabled={!isEditing || form.formState.isLoading}
                control={form.control}
                name={"graduationDate"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Date</FormLabel>
                    <FormControl>
                      <MonthYearPicker {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className={clsx("h-10 flex gap-2 justify-end", {
              'hidden': !isEditing
            })}>
              <Button
                variant={"outline"}
                onClick={() => { setIsEditing(false) }}
                disabled={form.formState.isLoading}
              >
                <FaXmark />
                Cancel
              </Button>
              <LoadingButton
                type={"submit"}
                loading={form.formState.isLoading}
              >
                <FaSave />
                {form.formState.isLoading ? "Saving" : "Save"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
