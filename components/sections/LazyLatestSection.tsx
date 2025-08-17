"use client";

import LazyBigCard from "@/components/cards/LazyBigCard";
import LazyHorizontalCard from "@/components/cards/LazyHorizontalCard";
import LazyVerticalCard from "@/components/cards/LazyVerticalCard";
import { getLatestArticlesFromEachCategory } from "@/lib/actions/article";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

function LazyLatestSection() {
	const { data: articles, isLoading, error } = useQuery({
		queryKey: ['latest-articles'],
		queryFn: getLatestArticlesFromEachCategory,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	if (isLoading) {
		return (
			<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
				<div className="animate-pulse">
					<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
					<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6">
						<div className="lg:col-span-4 h-64 lg:h-80 bg-gray-200 rounded"></div>
						<div className="lg:col-span-2 space-y-4">
							<div className="h-32 bg-gray-200 rounded"></div>
							<div className="h-32 bg-gray-200 rounded"></div>
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
					<p className="text-red-500">Failed to load latest articles. Please try again.</p>
				</div>
			</div>
		);
	}

	if (!articles || articles.length === 0) return null;

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Latest Articles
			</h2>
			
			{/* Hero Section */}
			<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12 items-stretch">
				{/* Latest Big Card */}
				<div className="lg:col-span-4">
					<LazyBigCard article={articles[0]} />
				</div>

				{/* Horizontal Cards */}
				<div className="lg:col-span-2 grid grid-cols-1 grid-rows-2 gap-4 sm:gap-6">
					<LazyHorizontalCard article={articles[1]} />
					<LazyHorizontalCard article={articles[2]} />
				</div>
			</div>

			{/* Vertical Card Section for small mobile */}
			<div className="sm:hidden lg:col-span-2 grid grid-cols-1 gap-6 mb-12">
				{articles.slice(3, 9).map((article) => (
					<LazyHorizontalCard
						key={`${article.title}-mobile`}
						article={article}
					/>
				))}
			</div>

			{/* Vertical Card Section for larger screens */}
			<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-12">
				{articles.slice(3, 15).map((article) => (
					<LazyVerticalCard
						key={`${article.title}-desktop`}
						article={article}
					/>
				))}
			</div>
		</div>
	);
}

export default memo(LazyLatestSection);
