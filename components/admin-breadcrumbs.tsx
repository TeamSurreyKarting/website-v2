import React, { ComponentProps, ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { titlecase } from "@/lib/titlecase";

export function AdminBreadcrumbs({ routes = [] }: { routes: string[] }) {
  let fullHref: string | undefined = undefined;
  const breadcrumbItems: ReactElement<any>[] = [];
  let breadcrumbPage: ReactElement<any> = <></>;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const href: string = fullHref ? `${fullHref}/${route}` : `/${route}`;
    fullHref = href;

    if (i === routes.length - 1) {

      breadcrumbPage = (
        <BreadcrumbItem>
          <AdminBreadcrumbPage>
            {titlecase(route)}
          </AdminBreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={href}>
          <BreadcrumbItem>
            <AdminBreadcrumbLink href={href}>
              {titlecase(route)}
            </AdminBreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </React.Fragment>,
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AdminBreadcrumbPage({ className, ...props }: ComponentProps<typeof BreadcrumbPage>) {
  return (
    <BreadcrumbPage className={cn("text-ts-gold-500 capitalize font-medium", className)} {...props} />
  )
}

export function AdminBreadcrumbLink({ className, ...props }: ComponentProps<typeof BreadcrumbLink>) {
  return (
    <BreadcrumbLink className={cn("text-ts-gold-700 underline capitalize font-medium", className)} {...props} />
  )
}