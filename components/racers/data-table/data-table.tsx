import { columns } from "@/components/racers/data-table/columns";
import { BaseDataTable } from "@/components/base-data-table";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

async function getData(
  searchQuery?: string,
): Promise<Database["public"]["Views"]["RacerDetails"]["Row"][]> {
  // Obtain list of racers
  const supabase = await createClient();

  // Build query
  const query = supabase.from("RacerDetails").select();

  if (searchQuery && searchQuery.trim().length > 0) {
    // If search query, do filter
    query.like("fullName", `%${searchQuery.trim()}%`);
  }

  const { data: racers } = await query;

  if (racers === null) {
    notFound();
    return [];
  }

  return racers;
}

export default async function RacersDataTable({ query }: { query?: string }) {
  const data = await getData(query);

  return <BaseDataTable columns={columns} data={data} />;
}
