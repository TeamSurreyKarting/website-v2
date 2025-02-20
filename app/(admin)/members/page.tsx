import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPencil } from "react-icons/fa6";
import { Suspense } from "react";
import MembersDataTable from "@/components/members/data-table/data-table";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import MembershipListFilters from "@/components/memberships/list-filters";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserPlus } from "lucide-react";

async function getMembershipTypes(): Promise<
  Tables<'MembershipTypes'>[] | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("MembershipTypes").select();

  if (error) {
    throw error;
  }

  return data;
}

async function getRacers(): Promise<
  Tables<'Racers'>[] | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("Racers").select();

  if (error) {
    throw error;
  }

  return data;
}

export default async function Page(props: {
  searchParams?: Promise<{
    memberships?: string;
    racers?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const membershipTypeFilterParam = searchParams?.memberships
    ? searchParams.memberships.split(",")
    : [];
  const racersFilterParams = searchParams?.racers
    ? searchParams.racers.split(",")
    : [];

  const [membershipTypes, racers] = await Promise.all([
    getMembershipTypes(),
    getRacers(),
  ]);

  if (!membershipTypes || !racers) {
    console.error("Error getting data")
    notFound();
  }

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Members</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <MembershipListFilters membershipTypes={membershipTypes} racers={racers} />
        <div className={"flex flex-row gap-2"}>
          <Link
            href={"/members/memberships"}
            className={"flex gap-2 items-center"}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"secondary"}>
                    <FaPencil />
                    <span className={"hidden md:block"}>Manage Membership Types</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage Membership Types</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <Link href={"/members/new"} className={"flex gap-2 items-center"}>
            <Button>
              <UserPlus />
              Assign
            </Button>
          </Link>
        </div>
      </div>
      <Suspense
        key={`${searchParams?.memberships}_${searchParams?.racers}}`}
        fallback={
          // <MembershipsTableSkeleton />
          <p>Loading...</p>
        }
      >
        <MembersDataTable
          membershipTypeIds={membershipTypeFilterParam}
          racerIds={racersFilterParams}
        />
      </Suspense>
    </div>
  );
}


