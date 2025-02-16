"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tables } from "@/database.types";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { format } from "date-fns";

export const columns: ColumnDef<
  Tables<'Events'>
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startsAt",
    header: "Start At",
    cell: ({ row }) => {
      const date = new Date(row.original.startsAt);
      return format(date, "HH:mm PPP");
    }
  },
  {
    accessorKey: "endsAt",
    header: "Ends At",
    cell: ({ row }) => {
      const date = new Date(row.original.endsAt);
      return format(date, "HH:mm PPP");
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className={"flex gap-2"}>
        <Link href={`/events/${row.original.id}`}>
          <Button variant={"ghost"}>
            <FaEye />
          </Button>
        </Link>
      </div>
    ),
  },
];
