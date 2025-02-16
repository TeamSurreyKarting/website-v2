"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import RacerCombobox from "@/components/racers/combobox";
import RacerMultiSelect from "@/components/racers/multi-select";
import { useRouter } from "next/navigation";
import { updateAssignees } from "@/utils/actions/tasks/update-assignees";

const formSchema = z.object({
  primaryResponsiblePerson: z
    .string({
      required_error: "Primary Responsible Person is required",
    })
    .uuid(),
  assignees: z
    .string()
    .array()
    .nonempty(),
});

export default function AssigneeEdit({
  taskId,
  primaryResponsiblePerson,
  assignees,
}: {
  taskId: string,
  primaryResponsiblePerson: string,
  assignees: string[],
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryResponsiblePerson,
      assignees,
    }
  });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    form.reset();
  }, [open]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { primaryResponsiblePerson: new_prp, assignees: new_ass } = values;

    try {
      await updateAssignees(taskId, new_prp, new_ass);

      toast({
        title: "Task Assignees Updated",
      });

      setOpen(false);
      form.reset();

      router.refresh();
    } catch (e) {
      toast({
        title: "Failed to update assignees",
        description: (e as Error).message,
      });
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
          Edit Assignees
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={"space-y-6"}
          >
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to the details for this task.
              </DialogDescription>
            </DialogHeader>
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