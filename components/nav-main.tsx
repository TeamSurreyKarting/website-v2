"use client"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type IconType } from "react-icons";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {clsx} from "clsx";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: IconType
  }[]
}) {
	const pathname = usePathname();

	return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
			const itemRelatesToActivePath = item.url === '/' ? pathname === item.url : pathname.startsWith(item.url)

			return (
				<SidebarMenuItem
					className={clsx('rounded-lg border-2 border-transparent', {
						'border-ts-gold-700 bg-ts-gold-700 text-black': itemRelatesToActivePath,
						'border-2 border-ts-blue-600 bg-ts-blue-700/50 hover:bg-ts-blue-500 hover:border-ts-blue-500': !itemRelatesToActivePath
					})}
					key={item.title}
				>
				  <SidebarMenuButton asChild size={"lg"} tooltip={item.title}>
					<Link href={item.url}>
					  <item.icon />
					  <span
						  className={clsx({
							  'font-bold': itemRelatesToActivePath,
						  })}
					  >{item.title}</span>
					</Link>
				  </SidebarMenuButton>
				</SidebarMenuItem>
			)
			}
		)}
      </SidebarMenu>
    </SidebarGroup>
  )
}
