import HorizontalCard from "@/components/HorizontalCard";
import VerticalCard from "@/components/VerticalCard";
import { Button } from "@/components/ui/button";
import { getArticlesByCategories } from "@/lib/actions/article";
import { CategoryName } from "@prisma/client";
import Link from "next/link";

// Cache for 24 hours
export const revalidate = 86400; // 24 hours in seconds

export default async function CategoryShowcaseSection() {
	const categoryArticles = await getArticlesByCategories(
		[
			CategoryName.nature_geography,
			CategoryName.technology_invention,
			CategoryName.culture_history,
		],
		6,
	);
	if (!categoryArticles || categoryArticles.length === 0) return null;

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Explore by Category
			</h2>

			{categoryArticles.map(({ categoryName, articles }) => (
				<div key={categoryName} className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<h3 className="font-serif text-2xl lg:text-3xl font-semibold capitalize">
							{categoryName.replace("_", " ")}
						</h3>
					</div>

					{/* Mobile Layout */}
					<div className="sm:hidden space-y-4">
						{articles.slice(0, 3).map((article) => (
							<HorizontalCard
								key={`${categoryName}-mobile-${article.id}`}
								article={article}
							/>
						))}
					</div>

					{/* Desktop Layout */}
					<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
						{articles.slice(0, 6).map((article) => (
							<VerticalCard
								key={`${categoryName}-desktop-${article.id}`}
								article={article}
							/>
						))}
					</div>
				</div>
			))}
			<div className="text-center text-xl text-muted-foreground font-semibold mt-12 mb-8">
				More categories available in the menu
			</div>
		</div>
	);
}
