import React, {ReactElement} from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumbs({routes = []}: {routes: string[]}) {
	let fullHref: string | undefined = undefined;
	const breadcrumbItems: ReactElement[] = [];
	let breadcrumbPage: ReactElement = (<></>);

	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		const href: string = fullHref ? `${fullHref}/${route}` : `/${route}`
		fullHref = href

		if (i === routes.length-1) {
			breadcrumbPage = (
				<BreadcrumbItem>
					<BreadcrumbPage className={"text-white capitalize"}>{route}</BreadcrumbPage>
				</BreadcrumbItem>
			)
		} else {
			breadcrumbItems.push(
				<React.Fragment key={href}>
					<BreadcrumbItem >
						<BreadcrumbLink className={"text-gray-300 capitalize"} href={href}>{route}</BreadcrumbLink>
					</BreadcrumbItem>
				</React.Fragment>
			)
		}
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbItems}
				{breadcrumbItems.length > 0 && (<BreadcrumbSeparator />)}
				{breadcrumbPage}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
