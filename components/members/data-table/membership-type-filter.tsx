"use client";

import { Database } from "@/database.types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function MembershipTypeFilter({
  membershipTypes,
}: {
  membershipTypes: Database["public"]["Tables"]["MembershipTypes"]["Row"][];
}) {
  const [open, setOpen] = useState(false);
  let [selectedMemberships, setSelectedMemberships] = useState<Array<string>>(
    [],
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams ?? undefined);

    if (selectedMemberships && selectedMemberships.length > 0) {
      // join membership ids with comma delimiter
      params.set("memberships", selectedMemberships.join(","));
    } else {
      params.delete("memberships");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedMemberships]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedMemberships.length > 0 ? "default" : "secondary"}
          role="combobox"
          aria-expanded={open}
          className="w-[225px] justify-between"
        >
          {selectedMemberships.length > 0 ? (
            <span>{selectedMemberships.length} Membership Selected</span>
          ) : (
            <span>All Membership Types</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[225px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No membership types found.</CommandEmpty>
            <CommandGroup>
              {membershipTypes.map((membershipType) => (
                <CommandItem
                  key={membershipType.id}
                  value={membershipType.id}
                  onSelect={(newMembership) => {
                    console.log(newMembership);
                    const isAlreadySelected =
                      selectedMemberships.includes(newMembership);

                    if (!isAlreadySelected) {
                      setSelectedMemberships([
                        ...selectedMemberships,
                        newMembership,
                      ]);
                    } else {
                      setSelectedMemberships(
                        selectedMemberships.filter((x) => x !== newMembership),
                      );
                    }

                    setOpen(false);
                  }}
                >
                  {membershipType.name}
                  <Check
                    className={clsx(
                      "ml-auto",
                      selectedMemberships.includes(membershipType.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
