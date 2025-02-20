import Search from "@/components/search";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Suspense } from "react";
import MembershipsDataTable from "@/components/memberships/data-table/data-table";

export default async function Page(props: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q ?? "";

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Memberships</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <Search />
        <Link
          href={"/members/memberships/new"}
          className={"flex gap-2 items-center"}
        >
          <Button>
            <FaPlus />
            Create
          </Button>
        </Link>
      </div>
      <Suspense
        key={query}
        fallback={
          // <MembershipsTableSkeleton />
          <p>Loading...</p>
        }
      >
        <MembershipsDataTable query={query} />
      </Suspense>
    </div>
  );
}
