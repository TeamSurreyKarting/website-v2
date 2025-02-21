"use client";

import { Database, Tables } from "@/database.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
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

export default function RacerFilter({
  racers,
  defaultValue,
}: {
  racers: Tables<"Racers">[],
  defaultValue: Tables<"Racers"> | undefined,
}) {
  const [open, setOpen] = useState(false);
  let [selectedRacer, setSelectedRacer] = useState<Tables<"Racers"> | undefined>(undefined);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams ?? undefined);

    if (selectedRacer) {
      // join membership ids with comma delimiter
      params.set("racers", selectedRacer.id);
    } else {
      params.delete("racers");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedRacer]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedRacer ? "default" : "secondary"}
          role="combobox"
          aria-expanded={open}
          className="w-[225px] justify-between"
        >
          {selectedRacer ? (
            <span>{selectedRacer.fullName}</span>
          ) : (
            <span>All Racers</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[225px] p-0 ">
        <Command>
          <CommandInput
            className={"text-gray-100"}
            placeholder="Search racers..."
          />
          <CommandList>
            <CommandEmpty>No racers found.</CommandEmpty>
            <CommandGroup>
              {racers.map((racer) => (
                <CommandItem
                  key={racer.id}
                  value={racer.id}
                  onSelect={(racerId) => {
                    console.log(racerId);
                    const isAlreadySelected = selectedRacer?.id === racerId;

                    if (isAlreadySelected) {
                      setSelectedRacer(undefined);
                    } else {
                      setSelectedRacer(
                        racers.find((r) => r.id === racerId)
                      );
                    }

                    setOpen(false);
                  }}
                >
                  {racer.fullName}
                  <Check
                    className={clsx(
                      "ml-auto",
                      selectedRacer?.id === racer.id
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
