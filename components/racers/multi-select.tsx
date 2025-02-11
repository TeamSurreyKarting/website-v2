"use client";

import { MultiSelect } from "@/components/ui/multi-select";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function RacerMultiSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string[];
  onValueChange(value: string[]): void;
}) {
  const [racers, setRacers] = useState<{ id: string; fullName: string }[]>([]);

  useEffect(() => {
    async function getRacers() {
      const supabase = createClient();

      const query = supabase.from("Racers").select("id, fullName");

      const { data: fetchedRacers, error } = await query;

      if (error) {
        console.error(error);
        throw error;
      }

      setRacers(fetchedRacers);
    }
    getRacers();
  }, []);

  return (
    <MultiSelect
      options={
        racers
          ? racers.map((racer) => {
              return { label: racer.fullName!, value: racer.id };
            })
          : []
      }
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={"bg-ts-blue"}
      variant={"inverted"}
      bottomActionButtons={false}
      toggleAllButton={false}
      maxCount={10}
    />
  );
}
