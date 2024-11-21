import "@/app/globals.scss";

import { AppSidebar } from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbList} from "@/components/ui/breadcrumb";

export default function AdminLayout({
	children,
	// breadcrumb,
}: Readonly<{
	children: React.ReactNode;
	// breadcrumb: Breadcrumb;
}>) {
	return (
		<SidebarProvider className={"bg-ts-blue-950 text-white"}>
			<AppSidebar />
			<SidebarInset className={"bg-ts-blue-700"}>
				<header className={"flex h-16 shrink-0 items-center gap-2"}>
					<div className={"flex items-center gap-2 px-4"}>
						<SidebarTrigger className={"-ml-1"} />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<span>Breadcrumb Goes Here</span>
						{/*{breadcrumb}*/}
					</div>
				</header>
				<div className={"m-4 mt-0"}>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
