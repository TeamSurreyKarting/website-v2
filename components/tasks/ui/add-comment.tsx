"use client";

import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import clsx from "clsx";
import { useCallback, KeyboardEvent, useRef } from "react";

const formSchema = z.object({
  content: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message is invalid",
    })
    .trim()
    .min(1),
});

export default function AddComment({ taskId }: { taskId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

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
    const { content } = values;

    console.log(content);

    const supabase = createClient();

    const { error } = await supabase.from("TaskComments").insert({
      content: content,
      task: taskId,
    });

    if (error) {
      toast({
        title: "Failed to send comment",
        description: error.message,
      });
    } else {
      toast({
        title: "Added comment",
      });

      form.reset();

      redirect(`/tasks/${taskId}`);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className={"mt-3 p-1 flex flex-row gap-1.5 items-center"}
      >
        <FormField
          control={form.control}
          name={"content"}
          render={({ field }) => (
            <FormItem className={"w-full"}>
              <FormControl>
                <Textarea
                  className={
                    "rounded-lg resize-none "
                  }
                  wrap={"soft"}
                  rows={1}
                  placeholder={"Type here..."}
                  onKeyDown={submitFromTextarea}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton
          className={
            "rounded-full m-0 p-2 h-full aspect-square border border-ts-blue-200 bg-ts-blue-200 hover:bg-ts-gold-500 hover:border-border text-foreground hover:text-black"
          }
          variant={"outline"}
          loading={form.formState.isSubmitting}
          type={"submit"}
        >
          <PiPaperPlaneRightFill
            className={clsx({
              hidden: form.formState.isSubmitting,
            })}
          />
        </LoadingButton>
      </form>
    </Form>
  );
}
