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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaCheck, FaPencil } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

const formSchema = z.object({
  otp: z.string().min(6).max(6),
});

export function OtpVerifyForm({
  email,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { email: string }) {
  const [otpIsValid, setOtpIsValid] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Request otp from supabase
    const supabase = createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email,
      token: values.otp,
      type: "email",
    });

    if (error) {
      form.setError("otp", { message: error.message });
      setOtpIsValid(false);
    } else {
      if (session) {
        router.push("/");
        setOtpIsValid(true);
      } else {
        form.setError("otp", { message: "Unknown error" });
        setOtpIsValid(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        <div>
          <FormField
            name={"email"}
            defaultValue={email}
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={"text-ts-gold-500"}>Email</FormLabel>
                <FormControl>
                  <Input placeholder={"you@surrey.ac.uk"} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Link href={"/auth"}>
            <Button variant={"link"} className={"text-white text-xs"}>
              <FaPencil />
              Change Email
            </Button>
          </Link>
        </div>
        <FormField
          control={form.control}
          name={"otp"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={"text-ts-gold-500"}>
                One Time Passcode
              </FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  onComplete={() => {
                    console.log("OTP is complete");
                    form.handleSubmit(onSubmit)();
                  }}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator className={"w-full"} />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className={"opacity-60"}>
                Enter the verification code sent to your email.
              </FormDescription>
              <FormMessage className={"text-red-700"} />
            </FormItem>
          )}
        />
        <LoadingButton
          variant={"secondary"}
          type={"submit"}
          className={clsx("w-full border bg-ts-blue-500 hover:bg-ts-blue-400", {
            "bg-ts-gold font-black": otpIsValid,
          })}
          loading={form.formState.isSubmitting && !otpIsValid}
        >
          {otpIsValid ? <FaCheck /> : <>Verify Login OTP</>}
        </LoadingButton>
      </form>
    </Form>
  );
}
