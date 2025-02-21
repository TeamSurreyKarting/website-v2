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
import { MembershipNested } from "@/utils/types/membership-nested";

async function getMembershipTypes(): Promise<Tables<'MembershipTypes'>[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("MembershipTypes")
      .select()
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

async function getRacers(): Promise<Tables<'Racers'>[]> {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("Racers")
      .select()
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    notFound();
  }
}

async function getMembers(membershipTypeId?: string, racerId?: string): Promise<MembershipNested[]> {
  try {
    const supabase = await createClient();

    const query = supabase
      .from("Members")
      .select(
        "id, addedAt, addedBy, MembershipTypes!inner( id, name, validFrom, validUntil ), Racers!inner( id, fullName )",
      )

    // Filter by selected membership type
    if (membershipTypeId) {
      query.eq("membership", membershipTypeId);
    }

    // Filter by selected racer
    if (racerId) {
      query.eq("racer", racerId);
    }

    const { data } = await query.throwOnError();

    return data.map((m) => {
      return {
        ...m,
        MembershipTypes: {
          ...m.MembershipTypes,
          validFrom: new Date(m.MembershipTypes.validFrom),
          validUntil: new Date(m.MembershipTypes.validUntil),
        }
      }
    });
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export default async function Page(props: {
  searchParams?: Promise<{
    memberships?: string;
    racers?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const membershipTypeFilterParam = searchParams?.memberships ?? undefined
  const racersFilterParams = searchParams?.racers ?? undefined

  const [membershipTypes, racers, members] = await Promise.all([
    getMembershipTypes(),
    getRacers(),
    getMembers(membershipTypeFilterParam, racersFilterParams),
  ]);

  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Members</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <MembershipListFilters
          membershipTypes={membershipTypes}
          defaultMembershipType={membershipTypeFilterParam}
          racers={racers}
        />
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
        <MembersDataTable members={members}/>
      </Suspense>
    </div>
  );
}


