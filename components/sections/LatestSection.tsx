"use client";

import { useLatestArticles } from "@/hooks/use-article-queries";
import BigCard from "@/components/BigCard";
import HorizontalCard from "@/components/HorizontalCard";
import VerticalCard from "@/components/VerticalCard";
import LatestSectionSkeleton from "@/components/skeletons/LatestSectionSkeleton";

export default function LatestSection() {
	const { data: articles, isLoading, isError } = useLatestArticles();

	if (isLoading) {
		return <LatestSectionSkeleton />;
	}

	if (isError || !articles || articles.length === 0) {
		// Optionally, render a specific error component
		return null;
	}

	const mainArticle = articles[0];
	const topArticles = articles.slice(1, 3);
	const sideArticles = articles.slice(3, 15);

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h2 className="font-serif lg:text-5xl text-3xl font-bold mb-6">
				Latest Articles
			</h2>
			
			{/* Hero Section */}
			<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12 items-stretch">
				{/* Latest Big Card */}
				<div className="lg:col-span-4">
					<BigCard article={articles[0]} />
				</div>

				{/* Horizontal Cards */}
				<div className="lg:col-span-2 grid grid-cols-1 grid-rows-2 gap-4 sm:gap-6">
					<HorizontalCard article={articles[1]} />
					<HorizontalCard article={articles[2]} />
				</div>
			</div>

			{/* Vertical Card Section for small mobile */}
			<div className="sm:hidden lg:col-span-2 grid grid-cols-1 gap-6 mb-12">
				{articles.slice(3, 9).map((article) => (
					<HorizontalCard
						key={`${article.title}-mobile`}
						article={article}
					/>
				))}
			</div>

			{/* Vertical Card Section for larger screens */}
			<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-12">
				{articles.slice(3, 15).map((article) => (
					<VerticalCard
						key={`${article.title}-desktop`}
						article={article}
					/>
				))}
			</div>
		</div>
	);
}
