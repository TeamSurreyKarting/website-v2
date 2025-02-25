"use client";

import { TableView } from "@/components/table-view";
import { columns } from "@/components/finances/transactions/columns";
import { Tables } from "@/database.types";
import { WindowCollectionView } from "@/components/collection-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { CircleChevronUp } from "lucide-react";

export default function TransactionsDataTable({
  data,
}: {
  data: Tables<'Transactions'>[];
}) {
  return (
    <>
      <WindowCollectionView data={data} renderItem={(item) => <TransactionCollectionViewItem item={item} />} className={"md:hidden"} />
      <TableView columns={columns} data={data} className={"hidden md:block"} />
    </>
  );
}

function TransactionCollectionViewItem({ item }: { item: Tables<'Transactions'> }) {
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const gbpFormat = Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className={"transform"}>
      <CardHeader>
        <div className={"flex flex-row items-center justify-between"}>
          <CardTitle>{item.itemDescription}</CardTitle>
          <Button variant={"ghost"} className={"h-fit w-9 p-0"} onClick={() => setExpanded(!isExpanded)}>
            <span className={"sr-only"}>Actions</span>
            <CircleChevronUp
              className={clsx("transition-transform", {
                "rotate-180": isExpanded,
              })}
            />
          </Button>
        </div>
        <CardDescription>{gbpFormat.format(item.value)}</CardDescription>
      </CardHeader>
      <CardContent className={clsx("hidden text-sm text-foreground/75", {
          "block": isExpanded
        })}
      >
        <span>Occurred At: {format(item.occurredAt, 'HH:mm, dd/MM/yy')}</span>
      </CardContent>
    </Card>
  );
}