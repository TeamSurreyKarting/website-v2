"use client";

import { TableView } from "@/components/table-view";
import { columns } from "@/components/members/data-table/columns";
import { MembershipNested } from "@/utils/types/membership-nested";
import { WindowCollectionView } from "@/components/collection-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { revokeMembership } from "@/utils/actions/memberships/revoke";
import { Spinner } from "@/components/ui/spinner";
import { Eye, MoreHorizontal } from "lucide-react";
import { FaTrashCan } from "react-icons/fa6";
import { useState } from "react";

export default function MembersDataTable({
  members
}: {
  members: MembershipNested[];
}) {
  return <>
    <WindowCollectionView
      data={members}
      renderItem={(item) => <MembersCollectionViewCard item={item} />}
      className={"md:hidden"}
    />
    <TableView columns={columns} data={members} className={"hidden md:block"} />
  </>
}

function MembersCollectionViewCard({ item }: { item: MembershipNested }) {
  const [dialogIsOpen, setDialogOpenState] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <div className={"flex flex-row items-center justify-between"}>
          <CardTitle>{item.Racers?.fullName}</CardTitle>
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
                    Revoke Membership
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
                  Confirm and Revoke Membership
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>{item.MembershipTypes?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className={"text-sm"}>Valid Until: <strong>{format(item.MembershipTypes?.validUntil!, 'dd/MM/y')}</strong></span>
      </CardContent>
    </Card>
  )
}