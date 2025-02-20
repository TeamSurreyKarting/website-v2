"use client";

import { Database } from "@/database.types";
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
}: {
  racers: Database["public"]["Tables"]["Racers"]["Row"][];
}) {
  const [open, setOpen] = useState(false);
  let [selectedRacers, setSelectedRacers] = useState<Array<string>>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams ?? undefined);

    if (selectedRacers && selectedRacers.length > 0) {
      // join membership ids with comma delimiter
      params.set("racers", selectedRacers.join(","));
    } else {
      params.delete("racers");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedRacers]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={selectedRacers.length > 0 ? "default" : "secondary"}
          role="combobox"
          aria-expanded={open}
          className="w-[225px] justify-between"
        >
          {selectedRacers.length > 0 ? (
            <span>
              {selectedRacers.length} Racer
              {selectedRacers.length === 1 ? "" : "s"} Selected
            </span>
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
                    const isAlreadySelected = selectedRacers.includes(racerId);

                    if (!isAlreadySelected) {
                      setSelectedRacers([...selectedRacers, racerId]);
                    } else {
                      setSelectedRacers(
                        selectedRacers.filter((x) => x !== racerId),
                      );
                    }

                    setOpen(false);
                  }}
                >
                  {racer.fullName}
                  <Check
                    className={clsx(
                      "ml-auto",
                      selectedRacers.includes(racer.id)
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
