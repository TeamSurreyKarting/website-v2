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
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import { FaEye } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { FaTrashCan } from "react-icons/fa6";
import Link from "next/link";

export const columns: ColumnDef<Database['public']['Views']['RacerDetails']['Row']>[] = [
	// {
	// 	accessorKey: 'id',
	// 	header: "Identifier",
	// },
	{
		accessorKey: 'fullName',
		header: "Name",
	},
	{
		accessorKey: 'email',
		header: "Email",
	},
	{
		id: 'actions',
		header: "Actions",
		cell: ({ row }) => {
			return (
				<div className={"flex gap-2"}>
					<Link
						href={`/racers/${row.original.id}`}
						>
						<Button
							variant={"ghost"}
							className={"hidden lg:block"}
						>
						<FaEye />
					</Button>
					</Link>
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
								<DropdownMenuItem
									className={"lg:hidden"}
								>
									<FaEye />
									View Details
								</DropdownMenuItem>
							</Link>
							{row.original.email ? (
								<Link href={`mailto:${row.original.email ?? ''}`}>
									<DropdownMenuItem>
											<RiMailSendLine />
											Send Email
									</DropdownMenuItem>
								</Link>
							) : (<></>)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className={"text-red-500 hover:text-red-50 focus:text-red-50 hover:bg-red-500 focus:bg-red-500 "}
							>
								<FaTrashCan />
								Delete Racer
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		}
	}
]
