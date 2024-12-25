import {OtpVerifyForm} from "@/components/auth/otp-verify-form";

export default async function AuthOTPPage(props : {
	searchParams?: Promise<{
		email?: string;
	}>;
}){
	const searchParams = await props.searchParams;
	const email = searchParams?.email ?? null;

	if (!email) {
		throw new Error("No email was supplied.")
	}

	return (<OtpVerifyForm email={email} />)
}
