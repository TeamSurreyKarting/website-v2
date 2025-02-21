import Search from "@/components/search";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Suspense } from "react";
import MembershipsDataTable from "@/components/memberships/data-table/data-table";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

async function getMemberships(
  searchQuery?: string,
): Promise<Tables<"MembershipTypes">[]> {
  try {
    const supabase = await createClient();

    // Build query
    const query = supabase.from("MembershipTypes").select();

    if (searchQuery && searchQuery.trim().length > 0) {
      // If search query, do filter
      query.like("name", `%${searchQuery.trim()}%`);
    }

    const { data: membershipTypes } = await query.throwOnError();

    return membershipTypes
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
  const query = searchParams?.q ?? "";

  const memberships = await getMemberships(query);

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
        <MembershipsDataTable memberships={memberships} />
      </Suspense>
    </div>
  );
}
