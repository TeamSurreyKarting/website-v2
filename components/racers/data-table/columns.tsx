"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import { RiMailSendLine } from "react-icons/ri";
import { FaTrashCan } from "react-icons/fa6";
import Link from "next/link";
import { IoIdCard } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import { deleteRacer } from "@/utils/actions/racers/delete";
import { useState } from "react";

export const columns: ColumnDef<
  Database["public"]["Views"]["RacerDetails"]["Row"]
>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDeleting, setIsDeleting] = useState(false);

      return (
        <div className={"flex gap-2"}>
          <Link href={`/racers/${row.original.id}`}>
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
                <Link href={`/racers/${row.original.id}`} className={"lg:hidden"}>
                  <DropdownMenuItem>
                    <Eye />
                    View Details
                  </DropdownMenuItem>
                </Link>
                {row.original.email && (
                  <Link href={`mailto:${row.original.email ?? ""}`}>
                    <DropdownMenuItem>
                      <RiMailSendLine />
                      Send Email
                    </DropdownMenuItem>
                  </Link>
                )}
                <Link href={`members/new?racer=${row.original.id}`}>
                  <DropdownMenuItem>
                    <IoIdCard />
                    Assign Membership
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
                    Delete Racer
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
                        throw new Error("No racer ID was supplied");
                      }

                      await deleteRacer(row.original.id);
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
