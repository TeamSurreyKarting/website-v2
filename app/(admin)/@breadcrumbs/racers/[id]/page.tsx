import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {createClient} from "@/utils/supabase/server";

async function fetchRacerName(userId: string): Promise<string | null> {
	const supabase = await createClient();

	const { data, error } = await supabase.from('Racers').select('fullName').eq('id', userId).single();

	return error ? null : data.fullName;
}

export default async function BreadcrumbSlot({params}: {params: {id: string}}) {
	const racerName = await fetchRacerName(params.id)

	return (
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink className={"text-gray-300"} href={"/racers"}>Racers</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage className={"text-white capitalize"}>{racerName ?? params.id}</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	);
}
