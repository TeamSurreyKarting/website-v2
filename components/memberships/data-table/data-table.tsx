import {columns} from "@/components/memberships/data-table/columns";
import {BaseDataTable} from "@/components/base-data-table";
import {Database} from "@/database.types";
import {createClient} from "@/utils/supabase/server";
import {notFound} from "next/navigation";

async function getData(searchQuery?: string): Promise<Database['public']['Tables']['MembershipTypes']['Row'][]> {
	const supabase = await createClient();

	// Build query
	const query = supabase.from("MembershipTypes").select();

	if (searchQuery && searchQuery.trim().length > 0) {
		// If search query, do filter
		query.like("name", `%${searchQuery.trim()}%`);
	}

	const { data: membershipTypes, error } = await query;

	if (error || membershipTypes === null) {
		notFound();
	}

	return membershipTypes;
}

export default async function MembershipsDataTable({ query }: { query?: string }) {
	const data = await getData(query);

	return (
		<BaseDataTable columns={columns} data={data} />
	);
}
