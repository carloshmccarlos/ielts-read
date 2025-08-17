"use client";

import LazyBigCard from "@/components/cards/LazyBigCard";
import LazyHorizontalCard from "@/components/cards/LazyHorizontalCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { fetchFeaturedArticles } from "@/lib/api/articles";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function LazyFeaturedSection() {
	const { data: articles, isLoading, error } = useQuery({
		queryKey: ['featured-articles'],
		queryFn: () => fetchFeaturedArticles(20),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	if (isLoading) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="animate-pulse">
					<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						<div className="lg:col-span-2 h-64 lg:h-80 bg-gray-200 rounded"></div>
						<div className="space-y-4">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="h-20 bg-gray-200 rounded"></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="text-center py-8">
					<p className="text-red-500">Failed to load featured articles. Please try again.</p>
				</div>
			</div>
		);
	}

	if (!articles || articles.length === 0) return null;

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<div className="flex items-center justify-between mb-6">
				<h2 className="font-serif lg:text-5xl text-3xl font-bold">
					Featured Articles
				</h2>
			</div>

			{/* Featured Hero Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				{/* Main Featured Article */}
				<div className="lg:col-span-2">
					<LazyBigCard article={articles[0]} />
				</div>

				{/* Side Featured Articles */}
				<div className="space-y-4">
					{articles.slice(1, 4).map((article) => (
						<LazyHorizontalCard
							key={`featured-side-${article.id}`}
							article={article}
						/>
					))}
				</div>
			</div>

			{/* Additional Featured Articles Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{articles.slice(4, 16).map((article) => (
					<LazyVerticalCard key={`featured-grid-${article.id}`} article={article} />
				))}
			</div>
		</div>
	);
}

export default memo(LazyFeaturedSection);
