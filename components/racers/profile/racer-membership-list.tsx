import { Database } from "@/database.types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import MembersDataTable from "@/components/members/data-table/data-table";

export default function RacerMembershipList({
  racerDetails,
}: {
  racerDetails: Database["public"]["Views"]["RacerDetails"]["Row"];
}) {
  return (
    <div
      className={
        "transition-colors my-6 rounded-lg bg-ts-blue-600 border-ts-blue-400 w-full border p-4"
      }
    >
      <div className={"h-10 flex gap-2 justify-between items-center"}>
        <h4 className={"font-medium text-xl"}>Memberships</h4>
        <Link href={`/members/new?racer=${racerDetails.id}`}>
          <Button variant={"outline"} className={"bg-ts-blue-400"}>
            <FaPlus />
            Assign Membership
          </Button>
        </Link>
      </div>
      <div className={"mt-4"}>
        <MembersDataTable
          racerIds={racerDetails.id ? [racerDetails.id] : undefined}
        />
      </div>
    </div>
  );
}
