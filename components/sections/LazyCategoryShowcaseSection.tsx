"use client";

import LazyHorizontalCard from "@/components/cards/LazyHorizontalCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { getArticlesByCategories } from "@/lib/actions/article";
import { CategoryName } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function LazyCategoryShowcaseSection() {
	const { data: categoryArticles, isLoading, error } = useQuery({
		queryKey: ['category-showcase-articles'],
		queryFn: () => getArticlesByCategories(
			[
				CategoryName.nature_geography,
				CategoryName.technology_invention,
				CategoryName.culture_history,
			],
			6
		),
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 20 * 60 * 1000, // 20 minutes
	});

	if (isLoading) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="animate-pulse">
					<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
					{[...Array(3)].map((_, categoryIndex) => (
						<div key={categoryIndex} className="mb-12">
							<div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
							<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="space-y-3">
										<div className="h-32 bg-gray-200 rounded"></div>
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
										<div className="h-4 bg-gray-200 rounded w-1/2"></div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="text-center py-8">
					<p className="text-red-500">Failed to load category articles. Please try again.</p>
				</div>
			</div>
		);
	}

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
							<LazyHorizontalCard
								key={`${categoryName}-mobile-${article.id}`}
								article={article}
							/>
						))}
					</div>

					{/* Desktop Layout */}
					<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
						{articles.slice(0, 6).map((article) => (
							<LazyVerticalCard
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

export default memo(LazyCategoryShowcaseSection);
