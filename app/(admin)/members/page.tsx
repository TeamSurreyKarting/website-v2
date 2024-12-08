import Link from "next/link";
import {Button} from "@/components/ui/button";
import {FaPencil, FaPlus} from "react-icons/fa6";
import {Suspense} from "react";
import MembersDataTable from "@/components/members/data-table/data-table";
import MembershipTypeFilter from "@/components/members/data-table/membership-type-filter";
import {Database} from "@/database.types";
import {createClient} from "@/utils/supabase/server";
import { IoFilterCircleOutline } from "react-icons/io5";
import RacerFilter from "@/components/members/data-table/racer-filter";

async function getMembershipTypes(): Promise<Database['public']['Tables']['MembershipTypes']['Row'][] | null> {
	const supabase = await createClient();

	const { data, error } = await supabase.from("MembershipTypes").select();

	if (error) {
		throw error;
	}

	return data;
}

async function getRacers(): Promise<Database['public']['Tables']['Racers']['Row'][] | null> {
	const supabase = await createClient();

	const { data, error } = await supabase.from("Racers").select();

	if (error) {
		throw error;
	}

	return data;
}

export default async function Page(props : {
	searchParams?: Promise<{
		memberships?: string;
		racers?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const membershipTypeFilterParam = searchParams?.memberships ? searchParams.memberships.split(",") : [];
	const racersFilterParams = searchParams?.racers ? searchParams.racers.split(",") : [];

	const [membershipTypes, racers] = await Promise.all([getMembershipTypes(), getRacers()]);

	return (
		<div className={"container mx-auto"}>
			<h2 className={"text-2xl font-bold"}>Members</h2>
			<div className="mx-auto my-2 flex justify-between gap-x-2">
				<div className={"flex flex-row gap-2 items-center"}>
					<IoFilterCircleOutline className="opacity-80 h-full aspect-square" />
					{ membershipTypes !== null && membershipTypes.length > 0 && (<MembershipTypeFilter membershipTypes={membershipTypes} />)}
					{ racers !== null && racers.length > 0 && (<RacerFilter racers={racers} />)}
				</div>
				<div className={"flex flex-row gap-2"}>
					<Link
						href={"/members/memberships"}
						className={"flex gap-2 items-center"}
					>
						<Button
							variant={"secondary"}
						>
							<FaPencil />
							Manage Membership Types
						</Button>
					</Link>
					<Link
						href={"/members/new"}
						className={"flex gap-2 items-center"}
					>
						<Button
							variant={"secondary"}
						>
							<FaPlus />
							Create
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
				<MembersDataTable membershipTypeIds={membershipTypeFilterParam} racerIds={racersFilterParams} />
			</Suspense>
		</div>
	);
}
