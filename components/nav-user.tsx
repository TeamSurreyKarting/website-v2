"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { PiDotsNineBold } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";
import logoutUser from "@/utils/actions/users/logout";

export function NavUser() {
  const [user, setUser] = useState<User | null>(null);
  const { isMobile } = useSidebar();

  const getAuthedUser = useCallback(async () => {
    const supabase = createClient();

    const user = await supabase.auth.getUser();

    setUser(user.data.user);
  }, [user]);

  useEffect(() => {
    getAuthedUser();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-16 border-2 border-ts-blue-600 bg-ts-blue-700/50 data-[state=open]:bg-ts-blue-600"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user ? (
                  <span className="truncate font-semibold">
                    {user.user_metadata.firstName} {user.user_metadata.lastName}
                  </span>
                ) : (
                  <Skeleton />
                )}
                {user ? (
                  <span className="truncate text-xs">{user.email}</span>
                ) : (
                  <Skeleton />
                )}
              </div>
              <PiDotsNineBold className="ml-auto size-6" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => {
                logoutUser();
              }}
            >
              <LogOut />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
