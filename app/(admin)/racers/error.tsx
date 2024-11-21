'use client';

import { useEffect } from "react";
import {Button} from "@/components/ui/button";
import { FaRedo } from "react-icons/fa";

export default function Error({
								  error,
								  reset,
							  }: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="w-full h-full bg-nile-blue-900 rounded-xl p-4 flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold">Error</h1>
			<p>Something went wrong...</p>
			<p>{error.message}</p>
			<Button
				onClick={() => reset()}
				variant={"secondary"}
				>
				<FaRedo />
				Retry
			</Button>
		</div>
	);
}
