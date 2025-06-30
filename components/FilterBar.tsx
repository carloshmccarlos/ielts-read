import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { transformCategoryName } from "@/lib/utils";
import type { Category } from "@prisma/client";

interface Props {
	categories: Category[];
	onChange: (value: string) => void;
	value: string;
}

export default function FilterBar({ categories, onChange, value }: Props) {
	return (
		<Select onValueChange={onChange} value={value}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Filter by category" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All Categories</SelectItem>
				{categories.map((category) => (
					<SelectItem key={category.name} value={category.name}>
						{transformCategoryName(category.name)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
