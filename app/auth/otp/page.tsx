import { OtpVerifyForm } from "@/components/auth/otp-verify-form";
import { redirect } from "next/navigation";

export default async function AuthOTPPage(props: {
  searchParams?: Promise<{
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email ?? null;

  if (!email) {
    console.error("No email was supplied.");
    redirect('/auth');
    return;
  }

  return <OtpVerifyForm email={email} />;
}
