import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Search from "@/components/search";
import RacersTableSkeleton from "@/components/racers/data-table/skeleton";
import RacersDataTable from "@/components/racers/data-table/data-table";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

async function getRacers(
  searchQuery?: string,
): Promise<Tables<"RacerDetails">[]> {
  try {
    // Obtain list of racers
    const supabase = await createClient();

    // Build query
    const query = supabase.from("RacerDetails").select();

    if (searchQuery && searchQuery.trim().length > 0) {
      // If search query, do filter
      query.ilike("fullName", `%${searchQuery.trim()}%`);
    }

    const { data } = await query.throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function Page(props: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q;

  const racers = await getRacers(query);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Racers</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <Search />
        <Link href={"/racers/new"} className={"flex gap-2 items-center"}>
          <Button>
            <FaPlus />
            Create
          </Button>
        </Link>
      </div>
      <Suspense key={query} fallback={<RacersTableSkeleton />}>
        <RacersDataTable data={racers} />
      </Suspense>
    </div>
  );
}
