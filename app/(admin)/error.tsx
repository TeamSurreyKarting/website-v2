'use client';

import {useEffect, useState} from "react";
import { FaRedo } from "react-icons/fa";
import {LoadingButton} from "@/components/ui/loading-button";

function formatErrorMessage(error: string) {
	try {
		return <code>{JSON.parse(error)}</code>
	} catch {
		return error
	}
}

export default function Error({
								  error,
								  reset,
							  }: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [isRetrying, setIsRetrying] = useState(false);

	useEffect(() => {
		console.error(error);
	}, [error]);

	const performRetry = () => {
		setIsRetrying(true);
		reset();
	}

	return (
		<div className="w-full h-full bg-nile-blue-900 rounded-xl p-4 flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold">Error</h1>
			<p className={"my-4 w-full rounded-lg bg-ts-blue-600 border border-ts-blue-300 font-mono text-sm p-4"}>{formatErrorMessage(error.message)}</p>
			<LoadingButton
				onClick={performRetry}
				variant={"secondary"}
				loading={isRetrying}
				>
				<FaRedo />
				Retry
			</LoadingButton>
		</div>
	);
}
