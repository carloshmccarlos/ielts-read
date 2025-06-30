import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface PaginationComponentProps {
	currentPage: number;
	totalPages: number;
	getPageHref: (page: number) => string;
}

export default function PaginationComponent({
	currentPage,
	totalPages,
	getPageHref,
}: PaginationComponentProps) {
	return (
		<nav className="flex items-center justify-center gap-4 font-[Open-serif]">
			<Link
				href={currentPage > 1 ? getPageHref(currentPage - 1) : "#"}
				className={`text-lg font-semibold p-2 rounded-md ${
					currentPage > 1
						? "black hover:bg-gray-100"
						: "text-gray-400 cursor-not-allowed"
				}`}
				aria-label="Previous page"
			>
				<ChevronLeftIcon className="w-6 h-6" />
			</Link>

			{currentPage === totalPages && currentPage !== 1 && (
				<Link
					href={getPageHref(currentPage - 2)}
					className="text-lg font-semibold px-4 py-2 rounded-md  hover:bg-gray-100"
				>
					{currentPage - 2}
				</Link>
			)}

			{currentPage >= 2 && (
				<Link
					href={getPageHref(currentPage - 1 === 0 ? 1 : currentPage - 1)}
					className=" text-lg font-semibold px-4 py-2 rounded-md   hover:bg-gray-100"
				>
					{currentPage - 1 === 0 ? 1 : currentPage - 1}
				</Link>
			)}

			<Link
				href={getPageHref(currentPage)}
				className=" text-lg font-semibold px-4 py-2 rounded-md   border-2 border-gray-500  "
				aria-current="page"
			>
				{currentPage}
			</Link>

			{totalPages - currentPage >= 1 && (
				<Link
					href={getPageHref(currentPage + 1)}
					className=" text-lg font-semibold px-4 py-2 rounded-md  hover:bg-gray-100"
				>
					{currentPage + 1}
				</Link>
			)}

			{currentPage === 1 && totalPages >= 3 && (
				<Link
					href={getPageHref(currentPage + 2)}
					className="text-lg font-semibold px-4 py-2 rounded-md   hover:bg-gray-100"
				>
					{currentPage + 2}
				</Link>
			)}

			{currentPage === totalPages || (
				<span className="px-4  text-lg font-semibold flex items-center">
					...
				</span>
			)}

			<Link
				href={currentPage < totalPages ? getPageHref(currentPage + 1) : "#"}
				className={`text-lg font-semibold p-2 rounded-md ${
					currentPage < totalPages
						? "text-gray-700 hover:bg-gray-100"
						: "text-gray-400 cursor-not-allowed"
				}`}
				aria-label="Next page"
			>
				<ChevronRightIcon className="w-6 h-6" />
			</Link>
		</nav>
	);
}
