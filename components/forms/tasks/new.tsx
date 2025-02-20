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
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import RacerCombobox from "@/components/racers/combobox";
import RacerMultiSelect from "@/components/racers/multi-select";
import { createNewTask } from "@/utils/actions/tasks/new";
import { FormDatePicker } from "@/components/ui/datetime-picker";
import FormStatusPicker from "@/components/tasks/ui/form/status-picker";
import FormPriorityPicker from "@/components/tasks/ui/form/priority-picker";

const formSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(3),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(3),
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
  assignees: z.string().array().nonempty(),
});

export function TaskForm({
  parentTaskId,
}: {
  parentTaskId: string | undefined;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueAt: new Date(),
      status: "Open",
      priority: "Medium",
      primaryResponsiblePerson: "",
      assignees: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      title,
      description,
      dueAt,
      status,
      priority,
      primaryResponsiblePerson,
      assignees,
    } = values;

    await createNewTask(
      title,
      description,
      dueAt,
      status,
      priority,
      primaryResponsiblePerson,
      assignees,
      parentTaskId,
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 mt-4"}>
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={"Title"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a description of the task"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"dueAt"}
          render={({ field }) => (
            <>
              <FormDatePicker
                label={"Due At"}
                defaultValue={field.value}
                onValueChange={field.onChange}
                fullWidth={false}
              />
              <FormMessage />
            </>
          )}
        />
        <div className={"grid grid-cols-1 md:grid-cols-2 gap-3"}>
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
        </div>
        <FormField
          control={form.control}
          name={"primaryResponsiblePerson"}
          render={({ field }) => (
            <FormItem className={"flex flex-col"}>
              <FormLabel>Primary Responsible Person</FormLabel>
              <RacerCombobox
                defaultValue={field.value}
                onValueChange={field.onChange}
                fullWidth={false}
              />
              <FormDescription>
                The person that is primarily responsible for overseeing this task&apos;s completion.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"assignees"}
          render={({ field }) => (
            <FormItem className={"flex flex-col"}>
              <FormLabel>Assignees</FormLabel>
              <FormControl>
                <RacerMultiSelect
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                All people responsible for the completion of this task.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          className={
            "float-right"
          }
          type={"submit"}
          loading={form.formState.isSubmitting}
        >
          Add Task
        </LoadingButton>
      </form>
    </Form>
  );
}
