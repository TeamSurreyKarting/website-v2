import {BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";

export default function BreadcrumbSlot() {

	return (
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink className={"text-gray-300"} href={"/finances"}>Finances</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage className={"text-white capitalize"}>New Account</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	);
}
