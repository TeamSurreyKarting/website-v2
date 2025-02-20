"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IoFilterCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RacerCombobox from "@/components/racers/combobox";

const formSchema = z.object({
  assignedTo: z.string().uuid(),
  dueBefore: z.date().min(new Date()).optional(),
})

export default function TaskViewFilters({
  assignedTo,
  dueBefore,
}: {
  assignedTo?: string,
  dueBefore?: Date
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedTo: assignedTo,
      dueBefore: dueBefore,
    },
  });
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const formValues = form.watch()

    if (formValues.assignedTo.length > 0) {
      params.set("assignedTo", formValues.assignedTo);
    } else {
      params.delete("assignedTo");
    }

    if (formValues.dueBefore) {
      params.set("dueBefore", formValues.dueBefore.toISOString());
    } else {
      params.delete("dueBefore");
    }

    replace(`${pathname}?${params.toString()}`);
  }, [form, form.watch, searchParams])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={form.watch().assignedTo.length > 0 ? "default" : "secondary"}
        >
          <IoFilterCircleOutline />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={"end"}
      >
        <Form {...form}>
          <form
            className={"space-y-6"}
          >
            <FormField
              control={form.control}
              name={"assignedTo"}
              render={({ field }) => (
                <FormItem className={"flex flex-col"}>
                  <FormLabel>Primarily Assigned To</FormLabel>
                  <RacerCombobox
                    defaultValue={field.value}
                    onValueChange={(value) => { field.onChange(value); setOpen(false); }}
                    fullWidth={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}