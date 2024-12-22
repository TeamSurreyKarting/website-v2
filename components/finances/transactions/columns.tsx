"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Spinner} from "@/components/ui/spinner";
import { FaEye, FaTrashCan } from "react-icons/fa6";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {deleteTransaction} from "@/utils/actions/finances/transactions/delete";

export const columns: ColumnDef<TxAccount>[] = [
	// {
	// 	header: "Transaction ID",
	// 	accessorKey: 'id',
	// },
	{
		header: "Account",
		accessorKey: 'Accounts.name',
		cell: ({ row }) => {
			return <Link href={`/finances?account=${row.original.Accounts?.id}`}>{row.original.Accounts?.name}</Link>
		},
	},
	{
		header: "Timestamp",
		accessorKey: 'occurredAt',
		cell: ({ row }) => {
			return new Date(row.original.occurredAt).toLocaleString('en-GB');
		}
	},
	{
		header: "Description",
		accessorKey: 'itemDescription'
	},
	{
		header: "Value",
		accessorKey: 'value',
		cell: ({ row }) => {
			return row.original.value.toLocaleString('en-GB', {
				style: 'currency',
				currency: 'GBP',
			});
		}
	},
	{
		id: 'actions',
		header: "Actions",
		cell: ({ row }) => {
			const [isDeleting, setIsDeleting] = useState(false);

			return (
				<div className={"flex gap-2"}>
					<Link
						href={`/finances/transactions/${row.original.id}`}
					>
						<Button
							variant={"ghost"}
							className={"hidden lg:block"}
						>
							<FaEye/>
						</Button>
					</Link>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant={"ghost"} className={"h-9 w-9 p-0"}>
									<span className={"sr-only"}>Actions</span>
									<MoreHorizontal className={"h-4 w-4"}/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align={"end"}>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<Link href={`/members/${row.original.id}`}>
									<DropdownMenuItem
										className={"lg:hidden"}
									>
										<FaEye/>
										View Details
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator/>
								<DialogTrigger asChild>
									<DropdownMenuItem
										className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "}
									>
										<FaTrashCan/>
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
											await deleteTransaction(row.original.id);
										} catch (e) {
											console.error(e);
										}
										setIsDeleting(false);
									}}>
									<Spinner show={isDeleting}/>
									Confirm
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
]
