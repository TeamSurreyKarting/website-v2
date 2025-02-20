import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Search from "@/components/search";
import RacersTableSkeleton from "@/components/racers/data-table/skeleton";
import RacersDataTable from "@/components/racers/data-table/data-table";

export default async function Page(props: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q ?? "";

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
        <RacersDataTable query={query} />
      </Suspense>
    </div>
  );
}
