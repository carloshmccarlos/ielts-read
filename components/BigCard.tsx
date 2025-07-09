import TextComponent from "@/components/TextComponent";
import { categoryToPath, titleToPath } from "@/lib/utils";
import type { CardProps } from "@/types/interface";
import Image from "next/image";
import Link from "next/link";

function BigCard({ article, className }: CardProps) {
	if (!article) {
		return null;
	}

	const titlePath = titleToPath(article.title);
	const categoryPath = categoryToPath(article.Category?.name || "");

	return (
		<Link
			href={`/article/${article.id}-${categoryPath}-${titlePath}`}
			className={`h-full shadow-sm hover:shadow-lg flex-col-reverse group bg-gray-100 hover:bg-gray-50 
			transition-all duration-500 rounded-sm flex flex-grow  md:flex-row w-full ${className}`}
		>
			<TextComponent
				article={article}
				titleSize={"text-2xl md:text-3xl lg:text-4xl"}
				className="w-full md:w-1/2 p-6 md:p-8"
			/>

			<div
				className=" rounded-sm  rounded-b-none md:rounded-l-none md:rounded-br-sm
			 relative w-full md:w-1/2 aspect-[10/7]  md:aspect-[10/8]  overflow-hidden"
			>
				<Image
					src={article.imageUrl}
					alt={article.title}
					fill
					className="object-cover  rounded-sm rounded-b-none md:rounded-l-none
					md:rounded-br-sm  transform group-hover:scale-105 transition-transform duration-200"
					sizes="(max-width: 1024px) 100vw, 60vw"
					priority
				/>
			</div>
		</Link>
	);
}

export default BigCard;
