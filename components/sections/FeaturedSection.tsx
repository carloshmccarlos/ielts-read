"use client";

import BigCard from "@/components/BigCard";
import HorizontalCard from "@/components/HorizontalCard";
import VerticalCard from "@/components/VerticalCard";

import { useFeaturedArticles } from "@/hooks/use-article-queries";
import Link from "next/link";
import FeaturedSectionSkeleton from "../skeletons/FeaturedSectionSkeleton";
import { ArticleWithDetails } from "@/lib/types";

export default function FeaturedSection() {
	const { data: articles, isLoading, isError } = useFeaturedArticles();

	if (isLoading) {
		return <FeaturedSectionSkeleton />;
	}

	if (isError || !articles || articles.length === 0) {
		return null;
	}

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
					<BigCard article={articles[0]} />
				</div>

				{/* Side Featured Articles */}
				<div className="space-y-4">
					{articles.slice(1, 4).map((article: ArticleWithDetails) => (
						<HorizontalCard
							key={`featured-side-${article.id}`}
							article={article}
						/>
					))}
				</div>
			</div>

			{/* Additional Featured Articles Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{articles.slice(4, 16).map((article: ArticleWithDetails) => (
					<VerticalCard key={`featured-grid-${article.id}`} article={article} />
				))}
			</div>
		</div>
	);
}
