"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export default function RacerCombobox({
  defaultValue,
  onValueChange,
  fullWidth,
}: {
  defaultValue?: string;
  onValueChange?(value: string): void;
  fullWidth: boolean;
}) {
  const [racers, setRacers] = useState<{ id: string; fullName: string }[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedRacer, setSelectedRacer] = useState<
    { id: string; fullName: string } | undefined
  >(undefined);

  // If a default value was provided, fetch the racer details
  useEffect(() => {
    async function getDefaultRacer() {
      const supabase = createClient();

      const query = supabase
        .from("Racers")
        .select("id, fullName")
        .eq("id", defaultValue)
        .single();

      const { data: racer, error } = await query;

      if (error) {
        console.error(error);
        throw error;
      }

      setSelectedRacer(racer);
    }
    if (defaultValue) {
      getDefaultRacer();
    }
  }, []);

  // When the `filter` is updated, fetch the racers matching the filter
  useEffect(() => {
    async function getRacers(filter?: string) {
      const supabase = createClient();

      const query = supabase.from("Racers").select("id, fullName").limit(5);

      if (filter && filter.trim().length > 0) {
        query.ilike("fullName", `%${filter}%`);
      }

      const { data: fetchedRacers, error } = await query;

      setLoading(false);

      if (error) {
        console.error(error);
        throw error;
      }

      setRacers(fetchedRacers);
    }
    getRacers(filter);
  }, [filter]);

  // Update the racers list, debounced
  const filterInputDidChange = useDebouncedCallback((filterTerm: string) => {
    setLoading(true);
    setFilter(filterTerm);
  }, 300);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="input"
          role="combobox"
          className={cn(
            "justify-between ",
            fullWidth ? "w-full mt-2" : "w-[200px]",
          )}
        >
          {selectedRacer?.fullName ?? "Select option"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align={"start"}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            onValueChange={filterInputDidChange}
          />
          {isLoading ? (
            <div className={"py-6"}>
              <Spinner show={isLoading} size="small" />
            </div>
          ) : (
            <CommandList>
              <CommandEmpty>No racers found. {racers.length}</CommandEmpty>
              <CommandGroup>
                {racers.map((racer) => (
                  <CommandItem
                    key={racer.id}
                    value={racer.id}
                    className={"hover:bg-ts-blue transition-colors"}
                    onSelect={(value) => {
                      setSelectedRacer(
                        selectedRacer?.id === value
                          ? undefined
                          : racers.find((r) => r.id === value),
                      );
                      onValueChange?.(value === defaultValue ? "" : value);

                      setIsOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        defaultValue === racer.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {racer.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
