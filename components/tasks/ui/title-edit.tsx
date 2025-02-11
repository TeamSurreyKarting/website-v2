"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPencil } from "react-icons/fa6";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createNewTask } from "@/utils/actions/tasks/new";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

const formSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(3),
});

export default function TitleEdit({
  defaultValue,
  taskId,
}: {
  defaultValue: string;
  taskId: string;
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValue,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title } = values;

    const supabase = createClient();

    const { error } = await supabase
      .from("Tasks")
      .update({ title: title })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Failed to update task title",
        description: error.message,
      });
    } else {
      toast({
        title: "Task Title Updated",
      });
      setIsEditing(false);
      redirect(`/tasks/${taskId}`);
    }
  }

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild>
        <div className={"group flex flex-row gap-3 items-center mb-3"}>
          <h2 className={"text-2xl font-bold"}>{defaultValue}</h2>
          <Button
            className={
              "bg-ts-blue-400 border border-ts-blue-300 opacity-0 group-hover:opacity-100 transition"
            }
          >
            <FaPencil />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <DialogHeader>
              <DialogTitle>Edit Task title</DialogTitle>
              <DialogDescription>
                Update the title of the task.
              </DialogDescription>
            </DialogHeader>
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
            <DialogFooter>
              <LoadingButton
                className={
                  "bg-ts-blue-400 border border-white hover:bg-white hover:text-black float-right"
                }
                loading={form.formState.isSubmitting}
                variant={"secondary"}
              >
                Update Title
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
