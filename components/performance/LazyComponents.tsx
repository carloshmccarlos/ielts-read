"use client";

import { lazy, Suspense, useState, useEffect, type ComponentType } from "react";
import { logBundleInfo } from "@/lib/performance/optimization";

// Generic lazy loading wrapper with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
	factory: () => Promise<{ default: T }>,
	componentName: string,
	fallback?: React.ReactNode,
) {
	const LazyComponent = lazy(() => {
		logBundleInfo(componentName);
		return factory();
	});

	return function WrappedLazyComponent(props: React.ComponentProps<T>) {
		return (
			<Suspense fallback={fallback || <ComponentSkeleton />}>
				<LazyComponent {...props} />
			</Suspense>
		);
	};
}

// Optimized skeleton components for better perceived performance
export function ComponentSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
			<div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
			<div className="h-4 bg-gray-200 rounded w-5/6"></div>
		</div>
	);
}

export function ArticleSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-8 bg-gray-200 rounded w-3/4"></div>
			<div className="h-4 bg-gray-200 rounded w-1/4"></div>
			<div className="space-y-2">
				<div className="h-4 bg-gray-200 rounded"></div>
				<div className="h-4 bg-gray-200 rounded w-5/6"></div>
				<div className="h-4 bg-gray-200 rounded w-4/5"></div>
			</div>
		</div>
	);
}

export function CardSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="bg-gray-200 h-48 rounded-t-lg"></div>
			<div className="p-4 space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4"></div>
				<div className="h-4 bg-gray-200 rounded w-1/2"></div>
			</div>
		</div>
	);
}

export function TableSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-8 bg-gray-200 rounded w-full"></div>
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex space-x-4">
					<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					<div className="h-4 bg-gray-200 rounded w-1/4"></div>
				</div>
			))}
		</div>
	);
}

// Lazy loaded components for code splitting
export const LazyArticleContent = createLazyComponent(
	() => import("@/components/ArticleContent").then(module => ({ default: module.default })),
	"ArticleContent",
	<ArticleSkeleton />,
);

// Note: Uncomment when ArticleTable component exists
// export const LazyAdminTable = createLazyComponent(
// 	() => import("@/components/admin/ArticleTable").then(module => ({ default: module.default })),
// 	"AdminTable",
// 	<TableSkeleton />,
// );

// Viewport-based lazy loading hook
export function useIntersectionObserver(
	ref: React.RefObject<Element>,
	options?: IntersectionObserverInit,
) {
	const [isIntersecting, setIsIntersecting] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
			},
			{
				threshold: 0.1,
				rootMargin: "50px",
				...options,
			},
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [ref, options]);

	return isIntersecting;
}

// Progressive image loading component
interface ProgressiveImageProps {
	src: string;
	alt: string;
	className?: string;
	placeholder?: string;
}

export function ProgressiveImage({
	src,
	alt,
	className,
	placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+",
}: ProgressiveImageProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(placeholder);

	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setCurrentSrc(src);
			setIsLoaded(true);
		};
		img.src = src;
	}, [src]);

	return (
		<img
			src={currentSrc}
			alt={alt}
			className={`transition-opacity duration-300 ${
				isLoaded ? "opacity-100" : "opacity-50"
			} ${className}`}
			loading="lazy"
		/>
	);
}
