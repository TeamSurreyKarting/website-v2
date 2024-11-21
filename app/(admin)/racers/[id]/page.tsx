import {Database} from "@/database.types";
import {createClient} from "@/utils/supabase/server";
import {notFound} from "next/navigation";
import RacerDetails from "@/components/racers/profile/racer-details";

type RacerProfile = {
	details: Database['public']['Views']['RacerDetails']['Row'];
}

async function getRacerDetails(id: string): Promise<Database['public']['Views']['RacerDetails']['Row'] | null> {
	const supabase = await createClient();

	const { data: racer } = await supabase.from("RacerDetails").select().eq("id", id).single();

	if (!racer) {
		return null;
	}

	return racer;
}

async function getUserProfileData(userId: string): Promise<RacerProfile | null> {
	const racerDetails = getRacerDetails(userId);
	const data = await Promise.all([
		racerDetails,
	]);

	if (data.includes(null)) {
		return null
	}

	return {
		details: data[0]!,
	};
}

export default async function Page({ params }: { params: { id: string } }) {
	const userId = params.id;
	const racerData = await getUserProfileData(userId);

	if (!racerData) {
		notFound();
	}

	return (
		<>
			<h2 className={"text-2xl font-bold"}>Racer Profile</h2>
			<h3 className={"text-xl font-medium text-ts-gold-700"}>{racerData.details.fullName ?? userId}</h3>
			<RacerDetails details={racerData.details} />
		</>
	);
}
