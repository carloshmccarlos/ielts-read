import OptimizedImage from "@/components/performance/OptimizedImage";
import TextComponent from "@/components/TextComponent";
import { categoryToPath, titleToPath } from "@/lib/utils";
import type { CardProps } from "@/types/interface";
import Link from "next/link";
import { memo } from "react";

function LazyHorizontalCard({ article, className }: CardProps) {
	if (!article) {
		return null;
	}

	const titlePath = titleToPath(article.title);
	const categoryPath = categoryToPath(article.Category?.name || "");

	return (
		<Link
			href={`/article/${article.id}-${categoryPath}-${titlePath}`}
			className={`shadow-sm hover:shadow-lg group bg-gray-100 hover:bg-gray-50 
			transition-all duration-500 rounded-sm flex h-full ${className}`}
		>
			<div className="rounded-l-sm relative w-2/5 aspect-[3/2] overflow-hidden">
				<OptimizedImage
					src={article.imageUrl}
					alt={article.title}
					fill={true}
					className="object-cover rounded-l-sm transform group-hover:scale-105 transition-transform duration-200"
					sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 20vw"
					priority={false}
					loading="lazy"
					placeholder="blur"
					quality={80}
					trackPerformance={true}
					lazyThreshold={0.05}
				/>
			</div>

			<div className="w-3/5">
				<TextComponent 
					article={article} 
					titleSize="text-sm md:text-base lg:text-lg"
					className="p-3 md:p-4"
				/>
			</div>
		</Link>
	);
}

export default memo(LazyHorizontalCard);
