"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/database.types";
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
import { FaTrashCan } from "react-icons/fa6";
import { deleteMembership } from "@/utils/actions/memberships/delete";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const columns: ColumnDef<
  Database["public"]["Tables"]["MembershipTypes"]["Row"]
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
  },
  {
    accessorKey: "validUntil",
    header: "Valid To",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const britishPounds = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      });

      return <span>{britishPounds.format(row.original.price)}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isDeleting, setIsDeleting] = useState(false);
      const [dialogIsOpen, setDialogOpenState] = useState(false);

      return (
        <div className={"flex gap-2"}>
          <Dialog open={dialogIsOpen} onOpenChange={setDialogOpenState}>
            <DialogTrigger asChild>
              <Button
                variant={"ghost"}
                className={
                  "text-destructive-foreground hover:bg-destructive focus:bg-destructive"
                }
              >
                <FaTrashCan />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className={"bg-destructive hover:bg-destructive focus:bg-destructive text-destructive-foreground"}
                  disabled={isDeleting}
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      await deleteMembership(row.original.id);
                      setDialogOpenState(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsDeleting(false);
                    }
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
