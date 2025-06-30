"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
	total: number;
	page: number;
	limit: number;
	onPageChange: (page: number) => void;
}

export default function PaginationControls({
	total,
	page,
	limit,
	onPageChange,
}: PaginationControlsProps) {
	const totalPages = Math.ceil(total / limit);

	const handlePrevious = () => {
		if (page > 1) {
			onPageChange(page - 1);
		}
	};

	const handleNext = () => {
		if (page < totalPages) {
			onPageChange(page + 1);
		}
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handlePrevious();
						}}
						className={page === 1 ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						{page}
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handleNext();
						}}
						className={
							page === totalPages ? "pointer-events-none opacity-50" : ""
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
} 