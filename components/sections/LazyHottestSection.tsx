"use client";

import LazyBigCard from "@/components/cards/LazyBigCard";
import NoImageCard from "@/components/NoImageCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { fetchHottestArticles } from "@/lib/api/articles";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function LazyHottestSection() {
	const { data: articles, isLoading, error } = useQuery({
		queryKey: ['hottest-articles'],
		queryFn: () => fetchHottestArticles(30),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	if (isLoading) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="animate-pulse">
					<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
					<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6">
						<div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-24 bg-gray-200 rounded"></div>
							))}
						</div>
						<div className="lg:col-span-4 h-64 lg:h-80 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="text-center py-8">
					<p className="text-red-500">Failed to load hottest articles. Please try again.</p>
				</div>
			</div>
		);
	}

	if (!articles || articles.length === 0) return null;

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Hottest Articles
			</h2>
			
			{/* Hero Section */}
			<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12 items-stretch">
				<div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 order-2 lg:order-1">
					{articles.slice(1, 5).map((article) => (
						<NoImageCard
							key={`${article.title}${article.id}`}
							article={article}
						/>
					))}
				</div>
				<div className="lg:col-span-4 order-1 lg:order-2">
					<LazyBigCard article={articles[0]} />
				</div>
			</div>

			{/* Additional Hottest Articles Grid */}
			<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-12">
				{articles.slice(5, 17).map((article) => (
					<LazyVerticalCard
						key={`hottest-${article.title}-${article.id}`}
						article={article}
					/>
				))}
			</div>
		</div>
	);
}

export default memo(LazyHottestSection);
