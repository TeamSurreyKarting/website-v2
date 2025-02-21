"use client";

import { Database, Tables } from "@/database.types";
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
  defaultValue,
}: {
  membershipTypes: Tables<"MembershipTypes">[],
  defaultValue: Tables<"MembershipTypes"> | undefined
}) {
  const [open, setOpen] = useState(false);
  let [selectedMembership, setSelectedMembership] = useState<Tables<"MembershipTypes"> | undefined>(defaultValue);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams ?? undefined);

    if (selectedMembership) {
      // join membership ids with comma delimiter
      params.set("memberships", selectedMembership.id);
    } else {
      params.delete("memberships");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedMembership]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedMembership ? "default" : "secondary"}
          role="combobox"
          aria-expanded={open}
          className="w-[225px] justify-between"
        >
          {selectedMembership ? (
            <span>{selectedMembership.name}</span>
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
                      selectedMembership?.id === newMembership;

                    if (isAlreadySelected) {
                      setSelectedMembership(undefined);
                    } else {
                      setSelectedMembership(
                        membershipTypes.find((mt) => mt.id === newMembership)
                      );
                    }

                    setOpen(false);
                  }}
                >
                  {membershipType.name}
                  <Check
                    className={clsx(
                      "ml-auto",
                      selectedMembership?.id === membershipType.id
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
