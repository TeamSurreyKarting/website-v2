"use client";

import { columns } from "@/components/memberships/data-table/columns";
import { TableView } from "@/components/table-view";
import { Database, Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { WindowCollectionView } from "@/components/collection-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleChevronRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteMembership } from "@/utils/actions/memberships/delete";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { revokeMembership } from "@/utils/actions/memberships/revoke";

export default function MembershipsDataTable({
  memberships,
}: {
  memberships: Tables<'MembershipTypes'>[],
}) {
  return <>
    <WindowCollectionView data={memberships} renderItem={(item) => <MembershipsCollectionViewCard item={item} />} className={"md:hidden"} />
    <TableView columns={columns} data={memberships} className={"hidden md:block"} />
  </>
}

function MembershipsCollectionViewCard({ item }: { item: Tables<'MembershipTypes'> }) {
  const gpbFormat = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <div className={"flex flex-row items-center justify-between"}>
          <CardTitle className={"font-bold text-xl"}>{item.name}</CardTitle>
          <Dialog open={dialogIsOpen} onOpenChange={setDialogOpenState}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className={"h-fit w-9 p-0"}>
                  <span className={"sr-only"}>Actions</span>
                  <MoreHorizontal className={"h-4 w-4"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={"end"}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className={
                      "text-red-500 hover:bg-destructive focus:bg-destructive hover:text-destructive-foreground focus:text-destructive-foreground"
                    }
                  >
                    <FaTrashCan />
                    Delete Membership Type
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All members assigned this membership will lose their allocation.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className={"mt-8 bg-destructive text-destructive-foreground hover:bg-destructive focus:bg-destructive"}
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await revokeMembership(item.id);
                      setDialogOpenState(false);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                >
                  <Spinner show={isDeleting} />
                  Delete Membership Type
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className={"text-lg"}>{gpbFormat.format(item.price)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={"text-sm text-foreground/75"}>Valid From: <strong>{format(item.validFrom, 'dd/MM/y')}</strong></p>
        <p className={"text-sm text-foreground/75"}>Valid Until: <strong>{format(item.validUntil, 'dd/MM/y')}</strong></p>
      </CardContent>
    </Card>
  )
}