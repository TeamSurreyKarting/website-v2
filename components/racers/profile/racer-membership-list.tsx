import { Database } from "@/database.types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import MembersDataTable from "@/components/members/data-table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RacerMembershipList({
  racerDetails,
}: {
  racerDetails: Database["public"]["Views"]["RacerDetails"]["Row"];
}) {
  return (
    <Card>
      <CardHeader className={"flex flex-row gap-2 justify-between items-center"}>
        <CardTitle className={"font-medium text-xl"}>Memberships</CardTitle>
        <Link href={`/members/new?racer=${racerDetails.id}`}>
          <Button>
            <FaPlus />
            Assign Membership
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <MembersDataTable
          racerIds={racerDetails.id ? [racerDetails.id] : undefined}
        />
      </CardContent>
    </Card>
  );
}
