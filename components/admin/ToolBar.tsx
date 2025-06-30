import FilterBar from "@/components/FilterBar";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { transformCategoryName } from "@/lib/utils";
import type { Category } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import Link from "next/link";
import { useRef } from "react";

interface Props<TData> {
	value: string;
	onChange: (value: string) => void;
	categories: Category[];
	handleDeleteSelected: () => void;
	isDeleting: boolean;
	selectedRowCount: number;
	table: Table<TData>;
}

export default function ToolBar<TData>({
	value,
	onChange,
	categories,
	handleDeleteSelected,
	isDeleting,
	selectedRowCount,
	table,
}: Props<TData>) {
	return (
		<div className="flex w-full items-center justify-between">
			<SearchInput
				search={(value) => {
					table.getColumn("title")?.setFilterValue(value);
				}}
			/>
			<div className="flex items-center justify-end space-x-4">
				<FilterBar categories={categories} onChange={onChange} value={value} />
				<Button asChild>
					<Link href="/admin/create">Create New Article</Link>
				</Button>
				<Button
					variant="destructive"
					onClick={handleDeleteSelected}
					disabled={isDeleting || selectedRowCount <= 0}
				>
					Delete Selected ({selectedRowCount})
				</Button>
			</div>
		</div>
	);
}
