"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import { deleteTask } from "@/utils/actions/tasks/delete";
import { format } from "date-fns";
function FaTrashCan() {
  return null;
}

export const columns: ColumnDef<
  Database["public"]["Views"]["TaskDetailsView"]["Row"]
>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "due_at",
    header: "Due Date",
    cell: ({ row }) => {
      return row.original.due_at ? format(row.original.due_at, 'd/M/y HH:mm') : "";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "primarily_responsible_person_full_name",
    header: "Primary Responsible Person",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDeleting, setIsDeleting] = useState(false);

      return (
        <div className={"flex gap-2"}>
          <Link href={`/tasks/${row.original.id}`}>
            <Button variant={"ghost"} className={"hidden lg:block"}>
              <Eye />
            </Button>
          </Link>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className={"h-9 w-9 p-0"}>
                  <span className={"sr-only"}>Actions</span>
                  <MoreHorizontal className={"h-4 w-4"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={"end"}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <Link href={`/racers/${row.original.id}`}>
                  <DropdownMenuItem className={"lg:hidden"}>
                    <Eye />
                    View Details
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className={
                      "text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "
                    }
                  >
                    <FaTrashCan />
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className={"bg-red-700 hover:bg-red-500"}
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      if (!row.original.id) {
                        throw new Error("No task ID was supplied");
                      }

                      await deleteTask(row.original.id);
                    } catch (e) {
                      console.error(e);
                    }
                    setIsDeleting(false);
                  }}
                >
                  <Spinner show={isDeleting} />
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
