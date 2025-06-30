import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import TextComponent from "@/components/TextComponent";
import { categoryToPath, titleToPath } from "@/lib/utils";
import type { CardProps } from "@/types/interface";

function VerticalCard({ article, className, readCount }: CardProps) {
	if (!article) {
		return null;
	}
	const titlePath = titleToPath(article.title);
	const categoryPath = categoryToPath(article.Category?.name || "");
	return (
		<Link
			href={`/article/${article.id}-${categoryPath}-${titlePath}`}
			className={`shadow-sm hover:shadow-lg group bg-gray-100  transition-all duration-500 rounded-sm flex flex-col h-full ${className}`}
		>
			<div className="rounded-t-sm relative aspect-[10/7] sm:aspect-[3/2] overflow-hidden">
				<Image
					src={article.imageUrl}
					alt={article.title}
					fill
					className="object-cover rounded-t-sm transform group-hover:scale-105 transition-transform duration-200"
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
				/>
			</div>

			<TextComponent article={article} readCount={readCount} />
		</Link>
	);
}

export default memo(VerticalCard);
