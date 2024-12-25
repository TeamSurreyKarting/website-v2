import { PiDotsNineBold } from "react-icons/pi";

import { Skeleton } from "@/components/ui/skeleton";

export async function NavUserSkeleton() {
	return (
		<div
			className="h-16 border-2 border-ts-blue-600 bg-ts-blue-700/50 data-[state=open]:bg-ts-blue-600"
			>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-semibold"><Skeleton /></span>
					<span className="truncate text-xs"><Skeleton /></span>
				</div>
				<PiDotsNineBold className="ml-auto size-6" />
		</div>
	)
}
