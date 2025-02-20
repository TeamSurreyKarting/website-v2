"use client"


import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";

import { type IconType } from "react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: IconType;
  }[];
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const itemRelatesToActivePath =
            item.url === "/"
            ? pathname === item.url
            : pathname.startsWith(item.url);

          return (
            <SidebarMenuItem
              key={item.url}
            >
              <SidebarMenuButton
                asChild
                size={isMobile ? "xl" : "lg"}
                tooltip={item.title}
                className={clsx("transition-colors", {
                  'bg-sidebar-active text-sidebar-active-foreground hover:bg-sidebar-active/80 hover:text-sidebar-active-foreground/80': itemRelatesToActivePath,
                })}
              >
                <Link href={item.url} onClick={() => { setOpenMobile(false); }}>
                  <item.icon />
                  <span
                    className={clsx({
                      "font-bold": itemRelatesToActivePath,
                    })}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
