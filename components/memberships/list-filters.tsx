"use client";

import { Tables } from "@/database.types";
import { useIsMobile } from "@/hooks/use-mobile";
import MembershipTypeFilter from "@/components/members/data-table/membership-type-filter";
import RacerFilter from "@/components/members/data-table/racer-filter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function MembershipListFilters({ membershipTypes, defaultMembershipType, racers, defaultRacer }: { membershipTypes: Tables<'MembershipTypes'>[], defaultMembershipType?: string, racers: Tables<'Racers'>[], defaultRacer?: string, }) {
  const isMobile = useIsMobile();

  const content = (
    <div className={"flex flex-col md:flex-row gap-2 items-center"}>
      <MembershipTypeFilter
        membershipTypes={membershipTypes}
        defaultValue={membershipTypes.find((mt) => mt.id === defaultMembershipType)}
      />
      <RacerFilter
        racers={racers}
        defaultValue={racers.find((r) => r.id === defaultRacer)}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            <Filter />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit" align={"start"}>
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (content)
}