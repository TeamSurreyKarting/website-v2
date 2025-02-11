"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();

    // Request otp from supabase
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error === null && data.user === null && data.session === null) {
      router.push(`/auth/otp?email=${values.email}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={"text-ts-gold-500"}>Email</FormLabel>
              <FormControl>
                <Input placeholder={"you@surrey.ac.uk"} {...field} />
              </FormControl>
              <FormDescription className={"opacity-60"}>
                An email will be sent with a one time verification code for you
                to sign in with.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          variant={"secondary"}
          type={"submit"}
          className={"w-full border bg-ts-blue-500 hover:bg-ts-blue-400"}
          loading={form.formState.isSubmitting}
        >
          Request Login OTP
        </LoadingButton>
      </form>
    </Form>
  );
}
