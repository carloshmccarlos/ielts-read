import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
	total: number;
	page: number;
	limit: number;
	makeHref?: (page: number) => string;
	onPageChange?: (page: number) => void;
}

export default function PaginationControls({
	total,
	page,
	limit,
	makeHref,
	onPageChange,
}: PaginationControlsProps) {
	const totalPages = Math.ceil(total / limit);
	if (totalPages <= 1) {
		return null;
	}

	const prevDisabled = page <= 1;
	const nextDisabled = page >= totalPages;

	const getHref = (targetPage: number) =>
		makeHref ? makeHref(targetPage) : "#";

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		disabled: boolean,
		targetPage: number,
	) => {
		if (disabled) {
			e.preventDefault();
			return;
		}
		if (onPageChange) {
			e.preventDefault();
			onPageChange(targetPage);
		}
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={prevDisabled ? "#" : getHref(page - 1)}
						aria-disabled={prevDisabled}
						tabIndex={prevDisabled ? -1 : undefined}
						className={cn(prevDisabled && "pointer-events-none opacity-50")}
						onClick={(event) => handleClick(event, prevDisabled, page - 1)}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive aria-current="page">
						{page}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						href={nextDisabled ? "#" : getHref(page + 1)}
						aria-disabled={nextDisabled}
						tabIndex={nextDisabled ? -1 : undefined}
						className={cn(nextDisabled && "pointer-events-none opacity-50")}
						onClick={(event) => handleClick(event, nextDisabled, page + 1)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}