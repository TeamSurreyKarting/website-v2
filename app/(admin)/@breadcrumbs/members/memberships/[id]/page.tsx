import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {createClient} from "@/utils/supabase/server";

async function fetchMembershipName(userId: string): Promise<string | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('MembershipTypes').select('name').eq('id', userId).single();

    return error ? null : data;
}

export default async function BreadcrumbSlot(props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const membershipName = await fetchMembershipName(params.id)

    return (
        <BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink className={"text-gray-300"} href={"/members"}>Members</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbLink className={"text-gray-300"} href={"/members/memberships"}>Memberships</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage className={"text-white capitalize"}>{membershipName ?? params.id}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    );
}
