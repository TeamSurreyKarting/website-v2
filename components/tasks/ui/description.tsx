"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useCallback, KeyboardEvent, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description is invalid",
    })
    .trim()
    .min(1),
});

export default function TaskDescription({
  taskId,
  defaultValue,
}: {
  taskId: string;
  defaultValue: string;
}) {
  if (!taskId) {
    throw new Error("Task ID must be provided");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: defaultValue,
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const submitFromTextarea = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        // submit form
        formRef.current?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      }
    },
    [onSubmit],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { description } = values;

    const supabase = createClient();

    const { error } = await supabase
      .from("Tasks")
      .update({
        description,
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
      form.reset();

      redirect(`/tasks/${taskId}`);
    }
  }

  return (
    <div className={"rounded-lg bg-ts-blue border border-ts-blue-400 mt-6 p-4"}>
      <div
        className={"flex flex-wrap items-center justify-between gap-x-2 mb-3"}
      >
        <div className={"flex flex-row gap-2.5"}>
          <h3 className={"text-lg font-medium"}>Description</h3>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              type={"button"}
              className={
                "bg-ts-blue-400 hover:bg-white hover:text-black float-right"
              }
            >
              Edit Description
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...form}>
              <form
                ref={formRef}
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
                  name={"description"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        className={
                          "rounded-lg resize-none bg-ts-blue-400 border-ts-blue-200"
                        }
                        wrap={"soft"}
                        rows={1}
                        placeholder={"Type here..."}
                        onKeyDown={submitFromTextarea}
                        autoFocus={true}
                        {...field}
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
      </div>
      <p className={"mt-1 mx-3"}>{defaultValue}</p>
    </div>
  );
}
