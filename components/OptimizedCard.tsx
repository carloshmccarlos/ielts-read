"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";
import { transformCategoryName } from "@/lib/utils";
import { usePerformanceMonitor } from "@/hooks/usePerformance";
import type { ArticleWithCategory } from "@/types/interface";

interface OptimizedCardProps {
	article: ArticleWithCategory;
	variant?: "big" | "horizontal" | "vertical" | "no-image";
	readCount?: number;
	priority?: boolean;
}

const OptimizedCard = memo<OptimizedCardProps>(({ 
	article, 
	variant = "vertical", 
	readCount,
	priority = false 
}) => {
	const { startRender, endRender } = usePerformanceMonitor(`OptimizedCard-${variant}`);
	
	// Memoize expensive computations
	const categoryName = useMemo(() => 
		transformCategoryName(article.Category?.name || ""), 
		[article.Category?.name]
	);
	
	const formattedDate = useMemo(() => 
		new Date(article.createdAt).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}), 
		[article.createdAt]
	);

	const truncatedTitle = useMemo(() => {
		if (variant === "big") return article.title;
		return article.title.length > 60 ? `${article.title.substring(0, 60)}...` : article.title;
	}, [article.title, variant]);

	const truncatedDescription = useMemo(() => {
		if (!article.description) return "";
		const maxLength = variant === "big" ? 150 : 80;
		return article.description.length > maxLength 
			? `${article.description.substring(0, maxLength)}...` 
			: article.description;
	}, [article.description, variant]);

	startRender();

	const cardContent = (
		<Card className="h-full hover:shadow-lg transition-shadow duration-200 group">
			{variant !== "no-image" && article.imageUrl && (
				<div className={`relative overflow-hidden rounded-t-lg ${
					variant === "big" ? "aspect-[16/9]" : 
					variant === "horizontal" ? "aspect-[4/3]" : "aspect-[3/2]"
				}`}>
					<OptimizedImage
						src={article.imageUrl}
						alt={article.title}
						fill
						priority={priority}
						sizes={
							variant === "big" ? "(max-width: 768px) 100vw, 66vw" :
							variant === "horizontal" ? "(max-width: 768px) 100vw, 33vw" :
							"(max-width: 768px) 50vw, 25vw"
						}
						className="group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
			)}
			
			<CardHeader className={variant === "big" ? "p-6" : "p-4"}>
				{categoryName && (
					<div className="text-sm font-semibold text-red-600 mb-2">
						{categoryName}
					</div>
				)}
				
				<h3 className={`font-bold leading-tight group-hover:text-blue-600 transition-colors ${
					variant === "big" ? "text-2xl mb-3" : "text-lg mb-2"
				}`}>
					{truncatedTitle}
				</h3>
				
				{truncatedDescription && (
					<p className={`text-gray-600 ${
						variant === "big" ? "text-base" : "text-sm"
					}`}>
						{truncatedDescription}
					</p>
				)}
			</CardHeader>
			
			<CardContent className={variant === "big" ? "px-6 pb-6" : "px-4 pb-4"}>
				<div className="flex items-center justify-between text-sm text-gray-500">
					<time>{formattedDate}</time>
					{readCount !== undefined && (
						<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
							Read {readCount} times
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	);

	endRender();

	return (
		<Link 
			href={`/article/${article.slug}`}
			className="block h-full"
			prefetch={priority}
		>
			{cardContent}
		</Link>
	);
});

OptimizedCard.displayName = "OptimizedCard";

export default OptimizedCard;
