import { cn, transformCategoryName } from "@/lib/utils";
import type { ArticleWithCategory } from "@/types/interface";

interface Props {
	className?: string;
	article: ArticleWithCategory;
	titleSize?: string;
	readCount?: number | null;
}

function TextComponent({ className, article, titleSize, readCount }: Props) {
	const showCategoryName = transformCategoryName(article.Category?.name || "");

	return (
		<>
			<div
				className={cn(
					"py-2 px-4 flex flex-col flex-grow gap-2 flex-wrap transform group-hover:scale-101" +
						" transition-all duration-300",
					className,
				)}
			>
				<div className="text-lg font-bold text-red-700 ">
					{showCategoryName}
				</div>
				<h2
					className={`${titleSize ? titleSize : "text-lg"}    font-bold flex justify-between`}
				>
					<div>
						<span
							className=" bg-[length:0%_2px]   bg-gradient-to-r from-pink-700 to-violet-700
					bg-no-repeat bg-left-bottom transition-all duration-700 group-hover:bg-[length:100%_2px]
					group-hover:bg-[position:left_bottom]"
						>
							{article.title}
						</span>
					</div>
				</h2>

				{titleSize && (
					<p className="text-gray-600 line-clamp-2 sm:line-clamp-3">
						{article.description}
					</p>
				)}
				<div className={"flex items-center justify-between mt-auto"}>
					<time className="text-sm text-gray-500 mt-auto font-[Open-serif]">
						{new Date(article.createdAt).toLocaleDateString()}
					</time>

					{readCount && (
						<span className="text-sm  font-[Open-serif] text-gray-500">
							Read {readCount} times
						</span>
					)}
				</div>
			</div>
		</>
	);
}

export default TextComponent;
