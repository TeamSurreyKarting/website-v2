"use client";

import { Database, Tables } from "@/database.types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import MembersDataTable from "@/components/members/data-table/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "@/components/members/data-table/columns";
import { TableView } from "@/components/table-view";
import { MembershipNested } from "@/utils/types/membership-nested";
import { Badge } from "@/components/ui/badge";
import { CollectionView, WindowCollectionView } from "@/components/collection-view";
import { format } from "date-fns";

export default function RacerMembershipList({ racerDetails, memberships }: {
  racerDetails: Tables<'RacerDetails'>,
  memberships: MembershipNested[]
}) {
  return (
    <Card className={"h-full"}>
      <CardHeader className={"flex flex-row gap-2 justify-between items-center"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <CardTitle className={"font-medium text-xl"}>Memberships</CardTitle>
          <Badge className={"bg-ts-blue-200 w-fit"} variant={"outline"}>
            {memberships.length}
          </Badge>
        </div>
        <Link href={`/members/new?racer=${racerDetails.id}`}>
          <Button>
            <FaPlus />
            <span className={"hidden md:block"}>Assign Membership</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent className={"h-full"}>
        <CollectionView data={memberships} renderItem={RacerMembershipCollectionViewCard} className={"md:hidden"} />
        <TableView columns={columns} data={memberships} className={"hidden md:block"} />
      </CardContent>
    </Card>
  );
}

function RacerMembershipCollectionViewCard(item: MembershipNested) {
  return (
    <Card className={"bg-secondary"}>
      <CardHeader>
        <CardTitle>{item.MembershipTypes?.name}</CardTitle>
        <CardDescription className={"text-foreground/70"}>Valid Until: <strong>{format(item.MembershipTypes?.validUntil!, "PPP")}</strong></CardDescription>
      </CardHeader>
    </Card>
  )
}