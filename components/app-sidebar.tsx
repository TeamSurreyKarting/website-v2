"use client"

import { ComponentProps } from "react"

import TSKC from "@/public/logos/tskc.svg";

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
import { FaHome, FaTasks } from "react-icons/fa"
import { GiFullMotorcycleHelmet } from "react-icons/gi"
import { IoIdCard } from "react-icons/io5"
import { PiPiggyBankFill } from "react-icons/pi"
import { FaCalendar } from "react-icons/fa6"

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
    {
      title: "Members",
      url: "/members",
      icon: IoIdCard,
      items: [],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: FaTasks,
      items: [],
    },
    {
      title: "Finances",
      url: "/finances",
      icon: PiPiggyBankFill,
      items: [],
    },
    {
      title: "Events",
      url: "/events",
      icon: FaCalendar,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <TSKC className={"h-auto hover:bg-none"} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
