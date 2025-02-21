"use client";

import { TableView } from "@/components/table-view";
import { columns } from "@/components/events/data-table/columns";
import { WindowCollectionView } from "@/components/collection-view";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CircleChevronRight } from "lucide-react";
import { Tables } from "@/database.types";

export default function EventsDataTable({
  events
}: {
  events: Tables<'Events'>[];
}) {
  const collectionData = events.map((ev) => {
    return {
      href: `/events/${ev.id}`,
      ...ev,
    }
  })

  return <>
    <WindowCollectionView
      data={collectionData}
      renderItem={(item) => <MembersCollectionViewCard item={item} />}
      className={"md:hidden"}
    />
    <TableView
      columns={columns}
      data={events}
      className={"hidden md:block"}
    />
  </>
}

function MembersCollectionViewCard({ item }: { item: Tables<'Events'> }) {
  return (
    <Card>
      <CardHeader className={"flex flex-row gap-1 items-center justify-between text-foreground"}>
        <div className={"flex flex-col gap-1"}>
          <CardTitle className={"font-bold text-xl"}>{item.name}</CardTitle>
          <CardDescription>{format(item.startsAt, 'PPP')}</CardDescription>
        </div>
        <CircleChevronRight />
      </CardHeader>
    </Card>
  )
}