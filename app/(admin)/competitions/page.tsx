import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CompetitionsDataTable from "@/components/competitions/data-table/data-table";

async function getCompetitions(searchQuery?: string): Promise<Tables<'Competitions'>[]> {
  try {
    const supabase = await createClient();

    const query = supabase.from("Competitions").select();

    const trimmedSearchQuery = searchQuery?.trim();
    if (trimmedSearchQuery && trimmedSearchQuery.length > 0) {
      query.ilike("name", `%${trimmedSearchQuery}%`);
    }

    const { data } = await query.throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function CompetitionsListPage(props: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q;

  const competitions = await getCompetitions(query);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Competitions</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <Search />
        <Link href={"/competitions/new"} className={"flex gap-2 items-center"}>
          <Button>
            <Plus />
            Create
          </Button>
        </Link>
      </div>
      <Suspense key={query} fallback={<p>Loading...</p>}>
        <CompetitionsDataTable data={competitions} />
      </Suspense>
    </div>
  )
}