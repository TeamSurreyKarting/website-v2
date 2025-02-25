"use client";

import { columns } from "@/components/competitions/data-table/columns";
import { TableView } from "@/components/table-view";
import { WindowCollectionView } from "@/components/collection-view";
import { Tables } from "@/database.types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleChevronRight } from "lucide-react";

export default function CompetitionsDataTable({ data }: { data: Tables<'Competitions'>[] }) {
  const collectionData = data.map((item) => {
    return {
      href: `/competitions/${item.id}`,
      ...item,
    }
  })

  return (
    <>
      <WindowCollectionView data={collectionData} renderItem={CompetitionsCollectionViewCard} className={"md:hidden mt-4 mb-16 h-full"}/>
      <TableView columns={columns} data={data} className={"hidden md:block"} />
    </>
  );
}

function CompetitionsCollectionViewCard(item: Tables<'Competitions'>) {
  return (
    <Card>
      <CardHeader className={"flex flex-row gap-1 items-center justify-between text-foreground"}>
        <CardTitle className={"font-bold text-xl"}>{item.name}</CardTitle>
        <CircleChevronRight />
      </CardHeader>
    </Card>
  );
}