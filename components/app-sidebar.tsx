"use client";

import { ComponentProps } from "react";

import TSKC from "@/public/logos/tskc.svg";

import { FaHome } from "react-icons/fa";
import { GiFullMotorcycleHelmet } from "react-icons/gi";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const sidebarItems = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: FaHome,
      items: [],
    },
    {
      title: "Racers",
      url: "/racers",
      icon: GiFullMotorcycleHelmet,
      items: [],
    },
  ],
  navSecondary: [],
	user: {
		name: "George Nick Gorzynski",
		email: "georgegorzynski@me.com",
		avatar: "",
	},
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
				<TSKC className={"h-auto"} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems.navMain} />
        <NavSecondary items={sidebarItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarItems.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
