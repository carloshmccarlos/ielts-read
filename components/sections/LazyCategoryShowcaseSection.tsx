"use client";

import LazyHorizontalCard from "@/components/cards/LazyHorizontalCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { fetchCategoryArticles } from "@/lib/api/articles";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function LazyCategoryShowcaseSection() {
	const { data: categoryData, isLoading, error } = useQuery({
		queryKey: ['category-showcase'],
		queryFn: () => fetchCategoryArticles([
			"nature-geography",
			"technology-invention",
			"culture-history",
			"entertainment-sports",
		], 6),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
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

	if (!categoryData || categoryData.length === 0) return null;

	return (
		<section className="py-8">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8">Explore by Category</h2>
				
				{categoryData && categoryData.length > 0 ? (
					<div className="space-y-12">
						{categoryData.map(({ categoryName, articles }: any) => (
							<div key={categoryName} className="">
								<h3 className="text-2xl font-semibold mb-6 capitalize">
									{categoryName.replace(/-/g, ' ')}
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{articles.slice(0, 3).map((article: any) => (
										<LazyVerticalCard key={article.id} article={article} />
									))}
								</div>
								<div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{articles.slice(3).map((article: any) => (
										<LazyHorizontalCard key={article.id} article={article} />
									))}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-gray-500">
						No articles found
					</div>
				)}
			</div>
		</section>
	);
}

export default memo(LazyCategoryShowcaseSection);
