"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Database } from "@/database.types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription, DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import { FaEye } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import Link from "next/link";
import {deleteMembership} from "@/utils/actions/memberships/delete";
import {useState} from "react";
import {Spinner} from "@/components/ui/spinner";

export const columns: ColumnDef<Database['public']['Tables']['MembershipTypes']['Row']>[] = [
	{
		accessorKey: 'name',
		header: "Name",
	},
	{
		accessorKey: 'validFrom',
		header: "Valid From",
	},
	{
		accessorKey: 'validUntil',
		header: "Valid To",
	},
	{
		accessorKey: 'price',
		header: "Price",
		cell: ({ row }) => {
			const britishPounds = new Intl.NumberFormat('en-GB', {
				style: 'currency',
				currency: 'GBP',
			});

			return (
				<span>{britishPounds.format(row.original.price)}</span>
			)
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
						href={`/members/memberships/${row.original.id}`}
						>
						<Button
							variant={"ghost"}
							className={"hidden lg:block"}
						>
						<FaEye />
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
								<Link href={`/members/memberships/${row.original.id}`}>
									<DropdownMenuItem
										className={"lg:hidden"}
									>
										<FaEye />
										View Details
									</DropdownMenuItem>
								</Link>
								<DropdownMenuSeparator />
								<DialogTrigger asChild>
									<DropdownMenuItem
										className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "}
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
											await deleteMembership(row.original.id);
										} catch (e) {
											console.error(e);
										}
										setIsDeleting(false);
									}}>
									<Spinner show={isDeleting} />
									Confirm
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		}
	}
]
