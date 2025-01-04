"use client";

import { Database } from "@/database.types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormDatePicker } from "@/components/ui/datetime-picker";
import FormStatusPicker from "@/components/tasks/ui/form/status-picker";
import RacerCombobox from "@/components/racers/combobox";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormPriorityPicker from "@/components/tasks/ui/form/priority-picker";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const formSchema = z.object({
  dueAt: z.date().min(new Date()),
  status: z
    .enum(["Open", "In Progress", "Blocked", "Completed", "Cancelled"])
    .default("Open"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  primaryResponsiblePerson: z
    .string({
      required_error: "Primary Responsible Person is required",
    })
    .uuid(),
});

export function EditTaskDetails(
  {
    values,
    taskId,
  }: {
    values: {
      dueAt: Date;
      status: Database["public"]["Enums"]["task_status"];
      priority: Database["public"]["Enums"]["task_priority"];
      primaryResponsiblePerson: string;
    };
    taskId: string | undefined;
  } = {
    values: {
      dueAt: new Date(),
      status: "Open",
      priority: "Medium",
      primaryResponsiblePerson: "",
    },
    taskId: undefined,
  },
) {
  if (!taskId) {
    throw new Error("Task ID must be provided");
  }
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // when state is set to closed, reset field values to defaults
  useEffect(() => {
    if (open === false) {
      form.reset();
    }
  }, [open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: values,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { dueAt, status, priority, primaryResponsiblePerson } = values;

    const supabase = createClient();

    const { error } = await supabase
      .from("Tasks")
      .update({
        due_at: dueAt,
        status: status,
        priority: priority,
        primarily_responsible_person: primaryResponsiblePerson,
      })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
      return null;
    } else {
      toast({
        title: "Task Details Updated",
      });
      setOpen(false);
      redirect(`/tasks/${taskId}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type={"button"}
          className={
            "bg-ts-blue-400 hover:bg-white hover:text-black float-right"
          }
        >
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to the details for this task.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name={"dueAt"}
              render={({ field }) => (
                <>
                  <FormDatePicker
                    label={"Due At"}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    fullWidth={true}
                  />
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name={"status"}
              render={({ field }) => (
                <>
                  <FormStatusPicker
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name={"priority"}
              render={({ field }) => (
                <>
                  <FormPriorityPicker
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name={"primaryResponsiblePerson"}
              render={({ field }) => (
                <FormItem className={"flex flex-col"}>
                  <FormLabel>Primary Responsible Person</FormLabel>
                  <RacerCombobox
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    fullWidth={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                className={
                  "bg-ts-blue-400 border border-white hover:bg-white hover:text-black float-right"
                }
                loading={form.formState.isSubmitting}
                variant={"secondary"}
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
