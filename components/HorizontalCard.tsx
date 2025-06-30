import TextComponent from "@/components/TextComponent";
import { categoryToPath, titleToPath } from "@/lib/utils";
import type { CardProps } from "@/types/interface";
import Image from "next/image";
import Link from "next/link";

function HorizontalCard({ readCount, article, className }: CardProps) {
	if (!article) {
		return null;
	}
	const titlePath = titleToPath(article.title);
	const categoryPath = categoryToPath(article.Category?.name || "");

	return (
		<Link
			href={`/article/${article.id}-${categoryPath}-${titlePath}`}
			className={`shadow-sm p-4 lg:p-0 group hover:shadow-lg bg-gray-100 hover:bg-gray-50 transition-all duration-500 rounded-sm flex flex-row w-full ${className}`}
		>
			<div
				className={
					" rounded-l-sm relative w-1/4 lg:w-1/3 overflow-hidden aspect-square"
				}
			>
				<Image
					src={article.imageUrl}
					alt={article.title}
					fill
					className="rounded-sm lg:rounded-r-none object-cover transform group-hover:scale-105 transition-transform duration-200"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
				/>
			</div>

			<TextComponent
				readCount={readCount}
				article={article}
				className={"w-3/4 lg:w-2/3"}
			/>
		</Link>
	);
}

// Memoize the component to prevent unnecessary re-renders
export default HorizontalCard;
