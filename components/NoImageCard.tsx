import TextComponent from "@/components/TextComponent";
import type { CardProps } from "@/types/interface";

import { categoryToPath, titleToPath } from "@/lib/utils";
import Link from "next/link";

function NoImageCard({ article, className }: CardProps) {
	if (!article) {
		return null;
	}
	const titlePath = titleToPath(article.title);
	const categoryPath = categoryToPath(article.Category?.name || "");
	return (
		<Link
			href={`/article/${article.id}-${categoryPath}-${titlePath}`}
			className={` flex flex-col flex-grow shadow-sm hover:shadow-lg group
			 bg-gray-100  transition-all duration-500 rounded-sm  ${className}`}
		>
			<TextComponent article={article} />
		</Link>
	);
}

export default NoImageCard;
