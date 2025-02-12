"use client";

import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { History } from "lucide-react";

export default function ShowPastEventsToggle() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const defaultValue = searchParams.get("showPastEvents");

  const handleStateChange = useCallback((showPastEvents: boolean) => {
    const params = new URLSearchParams(searchParams ?? undefined);

    if (showPastEvents) {
      params.set("showPastEvents", "true")
    } else {
      params.delete("showPastEvents")
    }

    replace(`${pathname}?${params.toString()}`);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            <History />
            <Label htmlFor="showPastEvents" className={"hidden"}>Show Past Events</Label>
            <Switch id="showPastEvents" checked={defaultValue === "true"} onCheckedChange={handleStateChange} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Show past events</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}