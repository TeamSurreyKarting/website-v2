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
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import MonthYearPicker from "@/components/ui/month-year-picker";
import { createMembershipType } from "@/utils/actions/memberships/new";
import { redirect } from "next/navigation";
import CurrencyInput from "react-currency-input-field";

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name is invalid",
      })
      .min(2),
    validFrom: z.date({
      required_error: "Date is required",
      invalid_type_error: "Date is invalid",
    }),
    validTo: z.date({
      required_error: "Date is required",
      invalid_type_error: "Date is invalid",
    }),
    price: z
      .number({
        required_error: "Price is required",
      })
      .multipleOf(0.01),
  })
  .refine((data) => data.validTo > data.validFrom, {
    message: "Valid To must be after Valid From",
    path: ["validTo"],
  });

export function NewMembershipTypeForm() {
  const dateNow = new Date();
  const dateRangeMin = new Date(dateNow.getFullYear() - 1, 8, 1);
  const dateRangeMax = new Date(dateNow.getFullYear() + 5, 7, 31);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      validFrom: new Date(dateNow.getMonth() >= 8 ? dateNow.getFullYear() : dateNow.getFullYear() - 1, 8, 1),
      validTo: new Date(dateNow.getMonth() < 8 ? dateNow.getFullYear() : dateNow.getFullYear() - 1, 7, 31),
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Create new entry
    await createMembershipType(
      values.name,
      values.validFrom,
      values.validTo,
      values.price,
    );

    redirect("/members/memberships");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
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
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-2"}>
          <FormField
            control={form.control}
            name={"validFrom"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <MonthYearPicker
                    minDate={dateRangeMin}
                    maxDate={dateRangeMax}
                    bypassValidation={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"validTo"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid To</FormLabel>
                <FormControl>
                  <MonthYearPicker
                    minDate={dateRangeMin}
                    maxDate={dateRangeMax}
                    bypassValidation={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"price"}
          render={({ field: { onChange, ...rest } }) => {
            return (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <CurrencyInput
                    customInput={Input}
                    prefix={"£"}
                    decimalsLimit={2}
                    decimalScale={2}
                    intlConfig={{ locale: "en-GB", currency: "GBP" }}
                    onValueChange={(value) => onChange(Number(value))}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <LoadingButton
          className={"float-right"}
          type={"submit"}
          loading={form.formState.isSubmitting}
        >
          Create Membership
        </LoadingButton>
      </form>
    </Form>
  );
}
