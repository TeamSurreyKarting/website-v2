"use client"

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function BaseDataTable<TData, TValue>({
											 columns,
											 data,
										 }: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	const tablePageSize = table.getState().pagination.pageSize
	const displayedTableRowIndexStart = table.getState().pagination.pageIndex + 1
	const displayedTableRowIndexEnd = tablePageSize > table.getState().pagination.pageIndex + 1 ? data.length : table.getState().pagination.pageIndex + tablePageSize
	const totalRowCount = data.length;

	return (
		<>
			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader className={"bg-ts-blue-500"}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className={"flex items-center justify-between space-x-2 py-4"}>
				<span className={"text-slate-600"}>
					Rows <span className={"text-slate-500"}>{displayedTableRowIndexStart}-{displayedTableRowIndexEnd}</span> of <span className={"text-slate-500"}>{totalRowCount}</span>
				</span>
				{(table.getCanPreviousPage() || table.getCanNextPage()) && (
					<div className={"flex items-center justify-between space-x-2 py-4"}>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant={"outline"}
							size={"sm"}
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				)}
			</div>
		</>
	)
}
